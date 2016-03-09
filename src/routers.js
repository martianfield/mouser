'use strict'
const path = require('path')
const jwt = require('jsonwebtoken')
const router_login = require('express').Router()
const Facebook = require(__dirname + '/auth-facebook.js')

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
    jwt.verify(token, "this_is_my_secret", function(err, decoded) {
      if (err) {
        res.send(`Token Error: ${err.name} | ${err.message}`);
      }
      else {
        res.send(`Token received: ${token}<hr>${JSON.stringify(decoded, null, 2)}`);
      }
    })
  }
})

router_login.use('/facebook', Facebook.router)

/*
router_login.get('/callback', (req,res) => {
  let token = req.query.token;
  if(token === undefined) {
    res.send("please try to login again");
  }
  else {
    // verify token
    jwt.verify(token, config.jwt.secret, function(err, decoded) {
      if (err) {
        res.send(`Token Error: ${err.name} | ${err.message}`);
      }
      else {
        res.send(`Token received: ${token}<hr>${JSON.stringify(decoded, null, 2)}`);
      }
    })
  }
})
*/

module.exports.login = router_login