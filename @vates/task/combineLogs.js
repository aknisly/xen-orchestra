'use strict'

const assert = require('node:assert').strict

function pick(source, keys, target = { __proto__: null }) {
  for (const key of keys) {
    const value = source[key]
    if (value !== undefined) {
      target[key] = source[key]
    }
  }
  return target
}

exports.makeOnProgress = function () {
  const tasks = new Map()
  function onProgress(log) {
    const { id, type } = log
    if (type === 'start') {
      const task = pick(log, ['data', 'id', 'name'])
      task.start = log.timestamp
      tasks.set(id, task)

      const { parentId } = log
      if (parentId === undefined) {
        // start of the root task
        onProgress.task = task
      } else {
        // start of a subtask
        const parent = tasks.get(parentId)
        assert.notEqual(parent, undefined)
        ;(parent.tasks ?? (parent.tasks = [])).push(task)
      }
    } else {
      const task = tasks.get(id)
      assert.notEqual(task, undefined)

      if (type === 'info' || type === 'warning') {
        const { data, message } = log
        ;(task[type] ?? (task[type] = [])).push({ data, message })
      } else if (type === 'property') {
        ;(task.properties ?? (task.properties = { __proto__: null }))[log.name] = log.value
      } else if (type === 'end') {
        task.end = log.timestamp
        task.result = log.result
        task.status = log.status
      }
    }
  }

  return onProgress
}
