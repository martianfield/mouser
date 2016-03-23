'use strict'
const path = require('path')
const jwt = require('jsonwebtoken')
const router_login = require('express').Router()
const Facebook = require(__dirname + '/auth-facebook.js')
const Google = require(__dirname + '/auth-google.js')
const configure = require(__dirname + '/configure.js')
const user_da = require(__dirname + '/user-da.js')
const log = require(__dirname + '/log.js')

router_login.get('/', (req, res) => {
  // display login select screen
  // TODO use a view instead
  res.sendFile(path.resolve(__dirname + '/../views/select_login.html'))
})

router_login.get('/callback', (req, res) => {
  let token = req.query.token;
  if(token === undefined) {
    res.send("please try to login again");
  }
  else {
    // verify token
    jwt.verify(token, configure.configuration.token.secret, function(err, decoded) {
      if (err) {
        // TODO display errors more gracefully ... display a view instead, or (probably better) return a HTTP error code (so the consumer of mouser can decide what to do)
        res.send(`Token Error: ${err.name} | ${err.message}`);
      }
      else {
        user_da.findOrCreate(decoded)
          .then(user => {
            log(`user found or created: ${JSON.stringify(user, null, 2)}`)
            // store token in session cookie TODO what if mouser is used in an app?
            req[configure.configuration.session.cookieName].user = token
            // redirect to requested page (or homepage if no page was requested)
            if (req[configure.configuration.session.cookieName] && req[configure.configuration.session.cookieName].requestedPage) {
              let requestedPage = req[configure.configuration.session.cookieName].requestedPage
              req[configure.configuration.session.cookieName].requestedPage = null
              res.redirect(requestedPage)
            }
            else {
              res.redirect('/')
            }


          })
          .catch(err => {
            // TODO handle error more gracefully
            res.send(`Token Error: ${err.name} | ${err.message}`);
          })

      }
    })
  }
})

router_login.use('/facebook', Facebook.router)
router_login.use('/google', Google.router)

module.exports.login = router_login