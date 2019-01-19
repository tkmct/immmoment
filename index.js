const moment = require('moment')

const instanceHandler = {
  get: function(target, prop, receiver) {
    const clone = target.clone()

    if (prop === 'add') {
      return new Proxy(clone[prop], {
        apply: function(target, that, args) {
          target.call(clone, ...args)
          return clone
        }
      })
    }

    return target[prop]
  }
}

module.exports = new Proxy(moment, {
  apply: function(target, that, args) {
    return new Proxy(target.apply(that, args), instanceHandler)
  },
})

// m = require('./index.js'); d = m();