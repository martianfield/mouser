'use strict'

const UserDA = require(__dirname + '/user-da.js')
const Facebook = require(__dirname + '/auth-facebook.js')
const Google = require(__dirname + '/auth-google.js')
const middleware = require(__dirname + '/middleware.js')
const routers = require(__dirname + '/routers.js')
const settings = require(__dirname + '/settings.js')

const options = {
  app: null
}

function use(target, values) {
  // TODO for some reason rest args do not work ... hence the nasty pre 2015 workaround below
  target = target.toLowerCase().trim()
  var values = Array.prototype.slice.call(arguments, use.length - 1);
  switch(target) {
    case 'db':
      UserDA.init(values[0])
      break
    case 'token':
      settings.token.secret = values[0]
      settings.token.expiresIn = values[1]
      break
    case 'session':
      settings.session.secret = values[0]
      settings.session.expiresIn = values[1]
      middleware.init()
      break
    case 'facebook':
      settings.providers.facebook.appId = values[0]
      settings.providers.facebook.appSecret = values[1]
      Facebook.init()
      break
    case 'google':
      settings.providers.google.appId = values[0]
      settings.providers.google.appSecret = values[1]
      Google.init()
      break
    case 'app':
      options.app = values[0]
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

