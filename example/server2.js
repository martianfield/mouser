'use strict'

const app = require('express')()
const config = require(__dirname + '/config.js')
const mouser = require(__dirname + '/../index.js')

const port = process.env.PORT || 8080

// turn log messages on
mouser.silent(false)

// set up token and session (Note: this needs to be done before setting the app)
mouser.use('token', config.token.secret, config.token.expiresIn)
mouser.use('session', config.session.secret, config.session.expiresIn )
// set up facebook and google (Note: this needs to be done before setting the app)
mouser.use('facebook', config.facebook.id, config.facebook.secret)
mouser.use('google', config.google.id, config.google.secret)

// tell mouser which app to use
mouser.use('app', app)

// require login on the all URIs starting with the the paths given
mouser.protect(['user', 'downloads'], true)


// basic route
app.get('/', (req, res) => {
  res.send("Hello world. ")
})

// another fake page
app.get('/blog', (req, res) => {
  res.send('The blog')
})

// last resort (404)
app.use(function(req, res) {
  res.status(404).send('Sorry cant find that!');
});


// run server
app.listen(port)
console.log(`serving at http://localhost:${port}`)


// ..................




// see here: https://stormpath.com/blog/everything-you-ever-wanted-to-know-about-node-dot-js-sessions/


