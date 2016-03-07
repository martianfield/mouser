'use strict'


const client_session = require('client-sessions')


module.exports.clientSession = client_session({
  cookieName: 'mouser',
  secret: 'my_super_secret',
  duration: 7 * 24 * 60 * 60 * 1000,
  activeDuration: 7 * 24 * 60 * 60 * 1000
})

module.exports.requireLogin = (req, res, next) => {
  console.log("checking login state")
  req.mouser.user = "<a jwt comes here>"
  if (req.mouser && req.mouser.user) {
    console.log("YES - mouser was here")
    console.log(req.mouser.user)
  }
  else {
    console.log("NO - mouser was not here")
  }
  next()
}
