'use strict'

const _ = require('lodash')
const client_session = require('client-sessions')
const path = require('path')

const authBasePath = 'auth/' // TODO make this a setting
const cookieName = 'mouser'

const options = {
  protectedPaths:[],
  protectBasePaths: true
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
  console.log("checking login state")

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
    console.log(`url is NOT protected [${req.url}]`)
    next()
  }
  else {
    console.log(`requested url IS protected [${req.url}]`)
    // is the user logged in? if not, display the login select page
    if (req[cookieName] && req[cookieName].user) {
      // user is logged in
      next()
    }
    else {
      // need login
      console.log("redirecting to login")
      res.redirect('/login')
    }
  }


}

module.exports.requireLogin = requireLogin
module.exports.protect = protect

module.exports.clientSession = client_session({
  cookieName: cookieName,
  secret: 'my_super_secret', // TODO make the cookie password a setting
  duration: 7 * 24 * 60 * 60 * 1000,
  activeDuration: 7 * 24 * 60 * 60 * 1000
})