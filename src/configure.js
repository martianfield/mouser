'use strict'

const jsen = require('jsen')
const fs = require('fs')
const schema = JSON.parse(fs.readFileSync(__dirname + '/settings-schema.json'))
const validate = jsen(schema)


const configure = (settings) => {
  this.errors = []
  if( ! validate(settings) ) {
    this.errors = validate.errors
    return false
  }
  return true
}


module.exports.configure = configure

// links:
// http://json-schema.org/
// https://github.com/bugventure/jsen