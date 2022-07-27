'use strict'

const { assert, match } = require('@sinonjs/referee')
const { test } = require('test')

const { Task } = require('./index.js')
const { makeOnProgress } = require('./combineLogs.js')

const noop = Function.prototype

test(async function (t) {
  const onProgress = makeOnProgress()
  const main = {
    name: 'my task',
    result: 'bar',
  }
  const sub1 = {
    name: 'subtask 1',
    result: 'foo',
  }
  const sub2 = {
    name: 'subtask 2',
    result: new Error(),
  }

  await Task.run({ name: main.name, onProgress }, async () => {
    Task.set('progress', 0)

    await Task.run({ name: sub1.name }, () => sub1.result)
    await Task.run({ name: sub2.name }, () => {
      throw sub2.result
    }).catch(noop)

    Task.set('progress', 1)

    return main.result
  })
  assert.equals(onProgress.task, {
    ...main,

    id: match.string,
    start: match.number,
    tasks: [
      {
        ...sub1,

        id: match.string,
        start: match.number,
        end: match.number,
        status: 'success',
      },
      {
        ...sub2,

        id: match.string,
        start: match.number,
        end: match.number,
        status: 'failure',
      },
    ],
    properties: {
      progress: 1,
    },
    end: match.number,
    status: 'success',
  })
})
