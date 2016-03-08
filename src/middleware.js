'use strict'


const client_session = require('client-sessions')
const path = require('path')

const authBasePath = 'auth/' // TODO make this a setting
const cookieName = 'mouser'

// TODO make the cookie password a setting
module.exports.clientSession = client_session({
  cookieName: cookieName,
  secret: 'my_super_secret',
  duration: 7 * 24 * 60 * 60 * 1000,
  activeDuration: 7 * 24 * 60 * 60 * 1000
})

module.exports.requireLogin = (req, res, next) => {
  console.log("checking login state")
  // in case the user is using this at app level, we need to make sure that at least the authentication pages work
  if(req.url.toLowerCase().startsWith(authBasePath)) {
    next()
  }

  // is the user logged in? if not, display the login select page
  if (req[cookieName] && req[cookieName].user) {
    // user is logged in
    next()
  }
  else {
    // need login
    // TODO use template engine instead
    res.sendFile(path.resolve(__dirname + '/../views/select_login.html'))
  }
}
