'use strict'

const UserDA = require(__dirname + '/user-da.js')
const providers = {
  'facebook': require(__dirname + '/auth-facebook.js'),
  'google': require(__dirname + '/auth-google.js')
}
const middleware = require(__dirname + '/middleware.js')
const routers = require(__dirname + '/routers.js')
const settings = require(__dirname + '/settings.js')

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
    case 'token':
      settings.token = value
      break
    case 'session':
      if(value.hasOwnProperty('cookieName') === false) {
        value.cookieName = settings.session.cookieName
      }
      settings.session = value
      middleware.init()
      break
    case 'facebook':
    case 'google':
      let appId = value.hasOwnProperty("appId") ? value.appId : null
      let appSecret = value.hasOwnProperty("appSecret") ? value.appSecret : null
      let active = appId !== null && appSecret !== null
      settings.providers[target] = {
        appId:appId,
        appSecret:appSecret,
        active:active
      }
      providers[target].init()
      break
    case 'app':
      options.app = value
      // make express use client-session on the app level
      options.app.use(middleware.clientSession())
      // make express use our login protecting middleware
      options.app.use(middleware.requireLogin)
      // add login routers
      options.app.use(`/${settings.paths.login}`, routers.login)
      break


  }
}


module.exports.use = use

