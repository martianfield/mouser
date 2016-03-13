'use strict'

const app = require('express')()
const config = require(__dirname + '/config.js')
const mouser = require(__dirname + '/../index.js')
const MongoClient = require('mongodb').MongoClient

const stuff = { }
const port = process.env.PORT || 8080

// turn log messages on
mouser.silent(false)

// set up token and session (Note: this needs to be done before setting the app)
mouser.use('token', {secret:config.token.secret, expiresIn:config.token.expiresIn})
mouser.use('session', {secret:config.session.secret, expiresIn:config.session.expiresIn} )
// set up facebook and google (Note: this needs to be done before setting the app)
mouser.use('facebook', {appId:config.facebook.id, appSecret:config.facebook.secret})
mouser.use('google', {appId:config.google.id, appSecret:config.google.secret})

// tell mouser which app to use
mouser.use('app', app)

// require login on the all URIs starting with the the paths given
mouser.protect(['user', 'downloads'], true)

// connect to database
MongoClient.connect(config.mongo.uri)
  .then(db => {
    stuff.db = db // we safe-keep the db so we can cleanup() later
    console.log("connected to database")
    // initialize database
    mouser.use("db", db)
    // output some info to the console (optional)
    mouser.info()
  })
  .catch(err => {
    console.log("error:", err)
  })


// basic route
app.get('/', (req, res) => {
  res.send("Hello world. ")
})

// the protected pages
app.get('/downloads', (req, res) => {
  res.send('Downloads')
})
app.get('/user', (req, res) => {
  res.send('User')
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


/*
// clean up stuff ......
process.on('SIGINT', cleanup)
process.on('SIGTERM', cleanup)

function cleanup() {
  console.log('cleaning up ... somebody gotta do the dirty work')
  if( stuff.db ) {
    stuff.db.close()
  }
}

*/


// see here: https://stormpath.com/blog/everything-you-ever-wanted-to-know-about-node-dot-js-sessions/


