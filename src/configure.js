'use strict'

const jsen = require('jsen')
const fs = require('fs')
const schema = JSON.parse(fs.readFileSync(__dirname + '/settings-schema.json'))
const validate = jsen(schema)

const o = { errors: []}

function configure(settings) {
  o.errors = []
  if( ! validate(settings) ) {
    o.errors = Array.from(validate.errors)
    return false
  }
  return true
}

Object.defineProperty(configure, 'errors', {
  get: function() { return o.errors },
  enumerable: true,
  configurable: true
})

module.exports.configure = configure
module.exports.errors = o.errors
//module.exports.errors = o.errors

// links:
// http://json-schema.org/
// https://github.com/bugventure/jsen