'use strict'

const _ = require('lodash')
const client_session = require('client-sessions')
const log = require(__dirname + '/log.js')
const settings = require(__dirname + '/settings.js')

const options = {
  protectedPaths:[],
  protectBasePaths: true,
  clientSession: null
}


function protect(paths, protectBasePath) {
  // clean up paths array
  options.protectedPaths = []
  paths.forEach(path => {
    // make sure the paths are lowercase and in the format '/pathname'
    let cleanedPath = '/' + _.trim(path.toLowerCase(), '/')
    options.protectedPaths.push(cleanedPath)
  })
  options.protectBasePaths = typeof protectBasePath !== 'undefined' ? Boolean(protectBasePath) : true

}

function requireLogin(req, res, next) {
  log("checking login state")

  // is the requested url protected?
  let isProtected = false
  for(let i=0; i < options.protectedPaths.length; i += 1) {
    let path = options.protectedPaths[i]
    if(options.protectBasePaths) {
      if( req.url.toLocaleLowerCase() === path) {
        isProtected = true
        break
      }
    }
    path += '/'
    if(req.url.toLowerCase().startsWith(path)) {
      isProtected = true
      break
    }
  }

  if(! isProtected ) {
    log(`url is NOT protected [${req.url}]`)
    next()
  }
  else {
    log(`requested url IS protected [${req.url}]`)
    // is the user logged in? if not, display the login select page and remember the page requested
    if (req[settings.session.cookieName] && req[settings.session.cookieName].user) {
      // user is logged in
      next()
    }
    else {
      // remember the page requested
      req[settings.session.cookieName].requestedPage = req.url
      // need login
      log("redirecting to login")
      res.redirect('/login')
    }
  }
}

function initClientSession() {
  options.clientSession = client_session({
    cookieName: settings.session.cookieName,
    secret: settings.session.secret,
    duration: settings.session.expiresIn,
    activeDuration: settings.session.expiresIn
  })
}

function init() {
  initClientSession()
}

module.exports.requireLogin = requireLogin
module.exports.protect = protect
module.exports.init = init
module.exports.clientSession = () => { return options.clientSession }