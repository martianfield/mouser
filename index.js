'use strict'

const use = require(__dirname + '/src/use.js')
const UserDA = require(__dirname + '/src/user-da.js')
const roles = require(__dirname + '/src/roles.js')
const middleware = require(__dirname + '/src/middleware.js')
const log = require(__dirname + '/src/log.js')
const settings = require(__dirname + '/src/settings.js')
const configure = require(__dirname + '/src/configure.js')

// settings via use
module.exports.use = use.use

// settings 
module.exports.configure = configure.configure
//module.exports.config = configure.config  // just an alias
//module.exports.configurationErrors = configure.errors
//module.exports.configErrors = configure.errors // just an alias

// user data access object
// TODO consider renaming
module.exports.users = UserDA.O

// user
module.exports.User = require(__dirname + '/src/user.js')

// roles functions
module.exports.hasRole = roles.hasRole
module.exports.addRole = roles.addRole
module.exports.removeRole = roles.removeRole

// middleware
module.exports.protect = middleware.protect

// info
module.exports.info = () => {
  console.log("Mouser Info")
  console.log(`- user DAO db: ${UserDA.db()}`)
  console.log(`- user DAO collection: ${settings.database.collection}`)
}

// log
module.exports.silent = (silent) => {
  log.options.silent = silent
}