'use strict'

const config = require(__dirname + '/config.js')
const mouser = require(__dirname + '/../index.js')
const MongoClient = require('mongodb').MongoClient

const stuff = { }

// tell mouser what mongo collection to use
mouser.use('collection', 'users') // 'users' is actually the default, so we could omit this
// tell mouser what the token secret is and when it expires
mouser.use('token', config.token.secret, config.token.expiresIn)
// as to Facebook and Google auth
mouser.use('facebook', config.facebook.id, config.facebook.secret)
mouser.use('google', config.google.id, config.google.secret)

// connect to database
MongoClient.connect(config.mongo.uri)
  .then(db => {
    stuff.db = db // we safe-keep the db so we can cleanup() later
    console.log("connected to database")
    // initialize database
    mouser.use("db", db)
  })
  .catch(err => {
    console.log("error:", err)
  })

// output some info to the console (optional)
mouser.info()







// clean up stuff ......

process.on('SIGINT', cleanup)
process.on('SIGTERM', cleanup)

function cleanup() {
  console.log('cleaning up ... somebody gotta do the dirty work')
  if( stuff.db ) {
    stuff.db.close()
  }
}