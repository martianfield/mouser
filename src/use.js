'use strict'

const UserDA = require(__dirname + '/user-da.js')
const middleware = require(__dirname + '/middleware.js')
const providers = {
  'facebook': require(__dirname + '/auth-facebook.js'),
  'google': require(__dirname + '/auth-google.js')
}
const routers = require(__dirname + '/routers.js')
const configure = require(__dirname + '/configure.js')

const options = {
  app: null
}

const use = (target, value) => {
  target = target.toLowerCase().trim()
  switch(target) {
    case 'db':
    case 'database':
      UserDA.init(value)
      break
    case 'app':
      // init provider middleware
      providers['facebook'].init()
      providers['google'].init()
      // set the app
      options.app = value
      // init middleware
      middleware.init()
      // make express use client-session on the app level
      options.app.use(middleware.clientSession())

      // add login routers
      options.app.use(`/${configure.configuration.paths.login}`, routers.login)
      // TODO add logout route
      break
  }
}


module.exports.use = use

