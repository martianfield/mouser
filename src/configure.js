'use strict'

const jsen = require('jsen')
const fs = require('fs')
const _ = require('lodash')

const o = {
  errors: [],
  warnings: [],
  configuration : {}
}

function configure(settings) {
  // reset
  o.errors = []
  o.warnings = []
  o.configuration = {}

  // load the schema and create JSEN validate method
  let schema = JSON.parse(fs.readFileSync(__dirname + '/configuration-schema.json'))
  let validate = jsen(schema, {greedy:true})

  // apply defaults (see JSEN documentation for details)
  let settingsWithDefaults = validate.build(settings)

  // validate
  if( ! validate(settingsWithDefaults) ) {
    o.errors = Array.from(validate.errors)
    return false
  }

  // save the configuration
  o.configuration = _.cloneDeep(settingsWithDefaults)

  // add warnings
  if(o.configuration.providers.facebook === undefined && o.configuration.providers.google === undefined) {
    o.warnings.push("no authentication provider specified - login will not be possible")
  }

  // done
  return true
}

Object.defineProperty(configure, 'errors', {
  get: function() {
    return o.errors
  },
  enumerable: true,
  configurable: true
})

Object.defineProperty(configure, 'warnings', {
  get: function() {
    return o.warnings
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