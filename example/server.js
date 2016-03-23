'use strict'

const app = require('express')()

const mouser = require(__dirname + '/../index.js')
const MongoClient = require('mongodb').MongoClient

const stuff = { }
const port = process.env.PORT || 8080
const mongoUri = "mongodb://localhost:27017/mouser"

// turn log messages on
mouser.silent(false)

// load an apply configuration
let config = require(__dirname + '/config.js')
if(mouser.configure(config) === false) {
  console.error("Invalid configuration\n", mouser.configure.errors)
  process.exit(1)
}
// output warnings (if any)
mouser.configure.warnings.forEach(warning => {
  console.log("config warning:", warning)
})

// tell mouser which app to use
mouser.use('app', app)

// require login on the all URIs starting with the the paths given
mouser.protect(['user', 'downloads'], true)

// connect to database
MongoClient.connect(mongoUri)
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


