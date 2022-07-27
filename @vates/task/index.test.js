'use strict'

const assert = require('node:assert').strict
const { describe, it } = require('test')

const { Task } = require('./index.js')

const noop = Function.prototype

function assertLog(task, expected, logIndex = -1) {
  const logs = task.$logs
  const actual = logs[logIndex < 0 ? logs.length + logIndex : logIndex]

  assert.equal(typeof actual, 'object')
  assert.equal(actual.id, task.id)
  assert.equal(typeof actual.timestamp, 'number')
  for (const keys of Object.keys(expected)) {
    assert.equal(actual[keys], expected[keys])
  }
}

function createTask(opts = {}) {
  let logs
  if (opts.onProgress === undefined) {
    logs = []
    opts.onProgress = logs.push.bind(logs)
  }
  const task = new Task({ name: 'test task', ...opts })
  task.$logs = logs
  return task
}
function createSubTask(opts) {
  assert.equal(opts.onProgress, undefined)
  return new Task({ name: 'test subtask', ...opts })
}

describe('Task', function () {
  describe('.abortSignal', function () {
    it('is undefined when run outside a task', function () {
      assert.equal(Task.abortSignal, undefined)
    })

    it('is the current abort signal when run inside a task', async function () {
      const task = createTask()
      await task.run(() => {
        const { abortSignal } = Task
        assert.equal(abortSignal.aborted, false)
        task.abort()
        assert.equal(abortSignal.aborted, true)
      })
    })
  })

  describe('.info()', function () {
    it('does nothing when run outside a task', function () {
      Task.info('foo')
    })

    it('emits an info message when run inside a task', async function () {
      const task = createTask()
      await task.run(() => {
        Task.info('foo')
        assertLog(task, {
          data: undefined,
          message: 'foo',
          type: 'info',
        })
      })
    })
  })

  describe('.set()', function () {
    it('does nothing when run outside a task', function () {
      Task.set('progress', 10)
    })

    it('emits an info message when run inside a task', async function () {
      const task = createTask()
      await task.run(() => {
        Task.set('progress', 10)
        assertLog(task, {
          name: 'progress',
          type: 'property',
          value: 10,
        })
      })
    })
  })

  describe('.warning()', function () {
    it('does nothing when run outside a task', function () {
      Task.warning('foo')
    })

    it('emits an warning message when run inside a task', async function () {
      const task = createTask()
      await task.run(() => {
        Task.warning('foo')
        assertLog(task, {
          data: undefined,
          message: 'foo',
          type: 'warning',
        })
      })
    })
  })

  describe('#id', function () {
    it('can be set', function () {
      const task = createTask()
      task.id = 'foo'
      assert.equal(task.id, 'foo')
    })

    it('cannot be set more than once', function () {
      const task = createTask()
      task.id = 'foo'

      assert.throws(() => {
        task.id = 'bar'
      }, TypeError)
    })

    it('is randomly generated if not set', function () {
      assert.notEqual(createTask().id, createTask().id)
    })

    it('cannot be set after being observed', function () {
      const task = createTask()
      noop(task.id)

      assert.throws(() => {
        task.id = 'bar'
      }, TypeError)
    })
  })

  describe('#status', function () {
    it('starts as pending', function () {
      assert.equal(createTask().status, 'pending')
    })

    it('changes to success when finish without error', async function () {
      const task = createTask()
      await task.run(noop)
      assert.equal(task.status, 'success')
    })

    it('changes to failure when finish with error', async function () {
      const task = createTask()
      await task
        .run(() => {
          throw Error()
        })
        .catch(noop)
      assert.equal(task.status, 'failure')
    })

    it('changes to aborting before run is complete', async function () {
      const task = createTask()
      await task.run(() => {
        task.abort()
        assert.equal(task.status, 'aborting')
      })

      assert.equal(task.status, 'aborted')
    })

    it('changes to aborted after run is complete', async function () {
      const task = createTask()
      await task.run(() => {
        task.abort()
      })
      assert.equal(task.status, 'aborted')
    })

    it('changes to aborted if aborted when not running', async function () {
      const task = createTask()
      task.abort()
      assert.equal(task.status, 'aborted')
    })
  })

  function makeRunTests(run) {
    it('finish the task on success', async function () {
      const task = createTask()
      await run(task, () => 'foo')
      assert.equal(task.status, 'success')
      assertLog(task, {
        status: 'success',
        result: 'foo',
        type: 'end',
      })
    })

    it('fails the task on error', async function () {
      const task = createTask()
      const e = new Error()
      await run(task, () => {
        throw e
      }).catch(noop)

      assert.equal(task.status, 'failure')
      assertLog(task, {
        status: 'failure',
        result: e,
        type: 'end',
      })
    })
  }
  describe('.run', function () {
    makeRunTests((task, fn) => task.run(fn))
  })
  describe('.wrap', function () {
    makeRunTests((task, fn) => task.wrap(fn)())
  })

  function makeRunInsideTests(run) {
    it("don't finish the task on success", async function () {
      const task = createTask()
      await run(task, () => 'foo')
      assert.equal(task.status, 'pending')
    })

    it('fails the task on error', async function () {
      const task = createTask()
      const e = new Error()
      await run(task, () => {
        throw e
      }).catch(noop)

      assert.equal(task.status, 'failure')
      assertLog(task, {
        status: 'failure',
        result: e,
        type: 'end',
      })
    })
  }
  describe('.runInside', function () {
    makeRunInsideTests((task, fn) => task.runInside(fn))
  })
  describe('.wrapInside', function () {
    makeRunInsideTests((task, fn) => task.wrapInside(fn)())
  })
})
