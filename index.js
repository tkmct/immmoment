const moment = require('moment')

const manipulations = [
  'add',
  'subtract',
  'startOf',
  'endOf',
  'max',
  'min',
  'local',
  'utc',
  'utcOffset',
  'zone'
]

const instanceHandler = {
  get: function(target, prop, receiver) {
    const clone = target.clone()

    if (manipulations.includes(prop)) {
      return new Proxy(clone[prop], {
        apply: function(target, that, args) {
          target.call(clone, ...args)
          return new Proxy(clone, instanceHandler)
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
