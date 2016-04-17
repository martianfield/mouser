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

/*
const Modes = Object.freeze({
  "Inclusive": "inclusive",
  "Exclusive": "exclusive"
})
*/

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

/**
 * Creates a middleware that opens a route to a set of given method / user combinations
 * @param an array of objects that describe method-role combinations
 */
function openRoute(options) {
  let parsedOptions = parseOptions(options)
}

/**
 *
 * @param options
 */
function closeRoute(options) {
  let parsedOptions = parseOptions(options)
}

/**
 * Parses route protection options.
 * @param options
 * @returns {{}}
 */
function parseOptions(options) {
  let parsed = {}
  options.forEach(option => {
    for(let propertyName in option) {
      if(option.hasOwnProperty(propertyName)) {
        let methods = propertyName.split(',').map(method => method.trim().toUpperCase())
        let roles = option[propertyName].split(',').map(role => role.trim().toLowerCase())
        methods.forEach(method => {
          if(!parsed.hasOwnProperty(method)) {
            parsed[method] = new Set()
          }
          roles.forEach(role => {
            parsed[method].add(role)
          })
        })
      }
    }
  })
  return parsed
}

/**
 * Creates a function that takes a HTTP Method and Role name and returns true if access is granted and false if not
 * @param options
 */
function makeCheckAccess(options) {
  let opts = parseOptions(options)
  return (method, role) => {
    method = method.toUpperCase()
    role = (role + "").toLowerCase()
    if(opts[method] === undefined) {
      // if nothing defined for given method we return false
      return false
    }
    else {
      // there is a role set available for the role in question
      if(opts[method].has(role) || opts[method].has('*')) {
        // if the role present or the role set contains the wildcard, the user has access
        return true
      }
      else {
        return false
      }
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
module.exports.openRoute = openRoute
module.exports.closeRoute = closeRoute
module.exports.parseOptions = parseOptions
module.exports.makeCheckAccess = makeCheckAccess
module.exports.init = init
module.exports.clientSession = () => { return options.clientSession }
