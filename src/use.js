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
  // TODO for some reason rest args do not work ... hence the nasty pre 2015 workaround below
  target = target.toLowerCase().trim()
  var values = Array.prototype.slice.call(arguments, use.length - 1);
  switch(target) {
    case 'db':
    case 'database':
      UserDA.init(value)
      break
    case 'token':
      settings.token = value
      break
    case 'session':
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

