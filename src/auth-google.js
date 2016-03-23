/*
 Google OAuth 2.0
 */

'use strict'

// get modules
const router = require('express').Router()
const jwt = require('jsonwebtoken')
const passport = require('passport')
const Strategy = require('passport-google-oauth').OAuth2Strategy
const configure = require(__dirname + '/configure.js')

const init = () => {
  // set up passport to use google oauth 2 strategy
  const strategyOptions = {
    clientID: configure.configuration.providers.google.appId,
    clientSecret: configure.configuration.providers.google.appSecret,
    callbackURL: `${configure.configuration.paths.base}/${configure.configuration.paths.login}/google/callback`
  }
  passport.use( new Strategy(
    strategyOptions,
    function(accessToken, refreshToken, profile, callback) {
      let err = null;
      return callback(err, profile);
    }
  ));

  // initialize passport
  router.use(passport.initialize());
}


// authentication requested
router.get(
  '/',
  passport.authenticate(
    'google',
    {session: false, scope: ['https://www.googleapis.com/auth/plus.login']}
  ),
  (req, res) => { /* never called , redirected to Google instead */}
);

// authentication callback
router.get(
  '/callback',
  passport.authenticate(
    'google',
    { failureRedirect: '/login', session: false}
  ),
  (req, res) => {
    if(req.user) {
      // create a user object
      let user = userFromRequest(req);
      // create token
      let token = jwt.sign(user, configure.configuration.token.secret, {expiresIn:configure.configuration.token.expiresIn});
      // redirect to login callback page, taking the token along so we can use it client side
      res.redirect('/login/callback?token=' + token);
    }
    else {
      res.send("There was an error logging in. Please try again.");
    }
  }
);

function userFromRequest(req) {
  // create a user object
  var name = req.user.name || {familyName:undefined, givenName:undefined, middleName:undefined};
  var user = {
    displayName: req.user.displayName,
    firstName: name.givenName,
    middleName: name.middleName,
    lastName: name.familyName,
    emails: [],
    gender: req.user.gender,
    auth: {
      provider: "google",
      id: req.user.id,
      displayName: req.user.displayName,
      profileUrl: req.user._json.url
    }
  }
  return user
}


module.exports.init = init
module.exports.router = router
