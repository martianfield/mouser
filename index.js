'use strict'

const use = require(__dirname + '/src/use.js')
const UserDA = require(__dirname + '/src/user-da.js')
const roles = require(__dirname + '/src/roles.js')
const middleware = require(__dirname + '/src/middleware.js')
const log = require(__dirname + '/src/log.js')
const configure = require(__dirname + '/src/configure.js')

const o = {}

// settings via use
o.use = use.use

// configuration
o.configure = configure
Object.defineProperty(o, 'configuration', {
  get: function() {
    return configure.configuration
  },
  enumerable: true
})

// user data access object
// TODO consider renaming
o.users = UserDA.O

// user
o.User = require(__dirname + '/src/user.js')

// roles functions
o.hasRole = roles.hasRole
o.addRole = roles.addRole
o.removeRole = roles.removeRole

// middleware
o.protect = middleware.protect
o.protectRoute = middleware.protectRoute

// info
o.info = () => {
  console.log("Mouser Info")
  console.log(`- user DAO db: ${UserDA.db()}`)
  console.log(`- user DAO collection: ${configure.configuration.db.userCollection}`)
}

// log
o.silent = (silent) => {
  log.options.silent = silent
}


module.exports = o