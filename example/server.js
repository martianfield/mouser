'use strict'

const config = require(__dirname + '/config.js')
const mouser = require(__dirname + '/../index.js')
const MongoClient = require('mongodb').MongoClient

const stuff = { }

mouser.use('collection', 'customers')


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

mouser.info()




process.on('SIGINT', cleanup)
process.on('SIGTERM', cleanup)

function cleanup() {
  console.log('cleaning up ... somebody gotta do the dirty work')
  if( stuff.db ) {
    stuff.db.close()
  }
}