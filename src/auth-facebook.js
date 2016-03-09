'use strict';
// get modules
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const settings = require(__dirname + '/settings.js')

// get configuration
//const config = require(__dirname + '/../../config/config.js');

const init = () => {
  // set up passport to use facebook strategy
  // TODO callback URL is hardcoded
  const optionsFacebook = {
    clientID: settings.providers.facebook.appId,
    clientSecret: settings.providers.facebook.appSecret,
    callbackURL: "http://localhost:8080/login/facebook/callback",
    profileFields: ['id', 'displayName', 'emails', 'name', 'profileUrl', 'gender']
  };
  passport.use( new FacebookStrategy(
    optionsFacebook,
    function(accessToken, refreshToken, profile, callback) {
      let err = null;
      return callback(err, profile);
    }
  ));

// initialize passport
  router.use(passport.initialize());
}


// facebook authentication requested
router.get('/', passport.authenticate('facebook', {session: false}))

// facebook authentication callback
router.get('/callback',
  passport.authenticate('facebook', { failureRedirect: '/login', session: false}),
  (req, res) => {
    if(req.user) {
      // create a user object
      let user = userFromRequest(req);
      // create token
      var token = jwt.sign(user, "this_is_my_secret", {expiresIn:10*24*60*60});
      // redirect to login callback page, taking the token along so we can use it client side
      res.redirect('/login/callback?token=' + token);
    }
    else {
      res.send("There was an error logging in. Please try again.")
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
    emails: req.user.emails,
    gender: req.user.gender,
    authDisplayName: req.user.displayName,
    authProvider: "facebook",
    authId: req.user.id,
    authProfileUrl: req.user.profileUrl
  }
  return user
}

module.exports.init = init
module.exports.router = router
