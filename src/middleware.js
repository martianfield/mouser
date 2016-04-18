'use strict'

const jwt = require('jsonwebtoken')
const _ = require('lodash')
const client_session = require('client-sessions')
const log = require(__dirname + '/log.js')
const configure = require(__dirname + '/configure.js')
const setthings = require('setthings')

const options = {
  clientSession: null
}

/**
 * 
 * @param options
 * @returns {function()}
 */
function protect(options) {
  let checkAccess = makeCheckAccess(options)
  return (req, res, next) => {
    let roles = []
    // did we get a user token in the request (i.e. is the user logged in?)
    if (req[configure.configuration.session.cookieName] && req[configure.configuration.session.cookieName].user) {
      let user_token = req[configure.configuration.session.cookieName].user
      // verify the token
      try {
        var decoded = jwt.verify(user_token, configure.configuration.token.secret)
        roles = decoded.user.roles
      } catch(err) {
        // verifying did throw an error, no valid user
        roles = []
      }
    }
    // check if the visitor has access
    if(checkAccess(req.method, roles)) {
      next()
    }
    else {
      res.send("GET OUT!")
    }
  }
}

/**
 * Parses route protection options.
 * @param options
 * @returns {{}}
 */
function parseOptions(options) {
  let parsed = {}
  // TODO if an object instead of an array is passed as options, we run into issues
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
  return (method, roles) => {
    let hasAccess = false
    method = method.toUpperCase()
    roles = roles.map(role => role.trim().toLowerCase())
    if(opts[method] === undefined) {
      // if nothing defined for given method we return false
      hasAccess = false
    }
    else {
      // if any role is accepted we can return true
      if(opts[method].has('*')) {
        hasAccess = true
      }
      else {
        // check if one of the roles grants access
        roles.forEach(role => {
          if(opts[method].has(role)) {
            hasAccess = true
          }
        })
      }

      // return result
      return hasAccess
    }
  }

}

/**
 *
 */
function init() {
  // init the client session
  options.clientSession = client_session({
    cookieName: configure.configuration.session.cookieName,
    secret: configure.configuration.session.secret,
    duration: configure.configuration.session.expiresIn,
    activeDuration: configure.configuration.session.expiresIn
  })
}


module.exports.protect = protect
module.exports.parseOptions = parseOptions
module.exports.makeCheckAccess = makeCheckAccess
module.exports.init = init
module.exports.clientSession = () => { return options.clientSession }
