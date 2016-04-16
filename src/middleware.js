'use strict'

const jwt = require('jsonwebtoken')
const _ = require('lodash')
const client_session = require('client-sessions')
const log = require(__dirname + '/log.js')
const configure = require(__dirname + '/configure.js')
const setthings = require('setthings')

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
    if (req[configure.configuration.session.cookieName] && req[configure.configuration.session.cookieName].user) {
      // TODO verify the stored token
      let user_token = req[configure.configuration.session.cookieName].user
      jwt.verify(user_token, configure.configuration.token.secret, function(err, decoded) {
        if(err) {
          res.send("MALFUNCTION") // TODO handle gracefully
        }
        else {
          next()
        }
      })
    }
    else {
      // remember the page requested
      req[configure.configuration.session.cookieName].requestedPage = req.url
      // need login
      log("redirecting to login")
      res.redirect('/login')
    }
  }
}

function protectRoute(options) {
  setthings.merge(options, { allow: []})
  return (req, res, next) => {
    let method = req.method
    if(options.allow.some( element => element.toUpperCase() === req.method)) {
      next()
    }
    else {
      res.send("YOU SHOULD NOT BE IN HERE")
      // TODO check if user is logged in
      // TODO check if user has the needed role
      // next()
    }
  }
}

function initClientSession() {
  options.clientSession = client_session({
    cookieName: configure.configuration.session.cookieName,
    secret: configure.configuration.session.secret,
    duration: configure.configuration.session.expiresIn,
    activeDuration: configure.configuration.session.expiresIn
  })
}

function init() {
  initClientSession()
}

module.exports.requireLogin = requireLogin
module.exports.protect = protect
module.exports.protectRoute = protectRoute
module.exports.init = init
module.exports.clientSession = () => { return options.clientSession }