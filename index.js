const moment = require('moment')

const instanceHandler = {
  get: function(target, prop, receiver) {
    if (typeof target[prop] === 'function') {
      const clone = target.clone()

      return new Proxy(clone[prop], {
        apply: function(target, that, args) {
          const ret = target.call(clone, ...args)

          return ret instanceof moment ? new Proxy(clone, instanceHandler) : ret
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
