'use strict'

const express = require('express')
const mouser = require(__dirname + '/../index.js')
const MongoClient = require('mongodb').MongoClient

const app = express()
const port = process.env.PORT || 8080
const mongoUri = "mongodb://localhost:27017/mouser"

// turn log messages on
mouser.silent(false)

// configure mouser (we assume the config is ok, see function configureMouser() below for an example on how to check for errors and warnings
let config = require(__dirname + '/config.js')
mouser.configure(config)

// tell mouser which app to use
mouser.use('app', app)

// connect to database
MongoClient.connect(mongoUri)
  .then(db => {
    console.log("connected to database")
    // initialize database
    mouser.use("db", db)
  })
  .catch(err => {
    console.log("error:", err)
  })


// home route
app.get('/', (req, res) => {
  res.send("Hello world. ")
})

// routes defined in separate file
const routes = require(__dirname + '/example2_routes.js')
app.use('/news', routes.news)
app.use('/downloads', routes.downloads)

// last resort (404)
app.use(function(req, res) {
  res.status(404).send('Sorry cant find that!');
});


// run server
app.listen(port)
console.log(`serving at http://localhost:${port}`)











function configureMouser() {
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
}
