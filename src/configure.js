'use strict'

const jsen = require('jsen')
const fs = require('fs')

const o = {
  errors: [],
  configuration : {}
}

function configure(settings) {
  // reset
  o.errors = []

  // load the schema and create JSEN validate method
  let schema = JSON.parse(fs.readFileSync(__dirname + '/settings-schema.json'))
  let validate = jsen(schema, {greedy:true})

  // apply defaults (see JSEN documentation for details)
  let settingsWithDefaults = validate.build(settings)

  // validate
  if( ! validate(settingsWithDefaults) ) {
    o.errors = Array.from(validate.errors)
    return false
  }
  o.configuration = settingsWithDefaults
  return true
}

Object.defineProperty(configure, 'errors', {
  get: function() {
    return o.errors
  },
  enumerable: true,
  configurable: true
})

Object.defineProperty(configure, 'configuration', {
  get: function() {
    return o.configuration
  },
  enumerable: true,
  configurable: true
})

module.exports = configure

// links:
// http://json-schema.org/
// https://github.com/bugventure/jsen