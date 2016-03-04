'use strict'

let settings = require(__dirname + '/src/settings.js')
let use = require(__dirname + '/src/use.js')

module.exports.set = settings.set
module.exports.settings = settings.settings
module.exports.use = use.use

