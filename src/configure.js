'use strict'

const jsen = require('jsen')
const fs = require('fs')
const schema = JSON.parse(fs.readFileSync(__dirname + '/settings-schema.json'))
const validate = jsen(schema)

//const o = { errors: []}

function configure(settings) {
  this.errors = []
  //o.errors = []
  if( ! validate(settings) ) {
    this.errors = Array.from(validate.errors)
    return false
  }
  return true
}


module.exports.configure = configure
//module.exports.errors = o.errors

// links:
// http://json-schema.org/
// https://github.com/bugventure/jsen