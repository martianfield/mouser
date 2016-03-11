'use strict'

const chai = require('chai')
const should = chai.should()
const expect = chai.expect

const mouser = require(__dirname + '/../index.js')
const use = require(__dirname + '/../src/use.js')
const userDA = require(__dirname + '/../src/user-da.js')
const MongoClient = require('mongodb').MongoClient

describe("User Data Access", () => {
  let collection = 'users_test'
  let uri = "mongodb://localhost:27017/mouser"

  after(done => {
    let db = null
    MongoClient.connect(uri)
      .then(database => {
        db = database
        db.collection(collection).drop()
      })
      .then(result => {
        db.close()
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('create()', (done) => {
    let db = null
    MongoClient.connect(uri)
      .then(database => {
        db = database
        mouser.use('database', db, collection)
        return userDA.create({name:"Rory Bosio"})
      })
      .then(doc => {
        expect(doc.name).to.equal('Rory Bosio')
        db.close()
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('find()', (done) => {
    let db = null
    MongoClient.connect("mongodb://localhost:27017/mouser")
      .then(database => {
        db = database
        mouser.use('database', db, collection)
        return userDA.find({})
      })
      .then(docs => {
        let doc = docs[0]
        expect(doc.name).to.equal('Rory Bosio')
        db.close()
        done()
      })
      .catch(err => {
        done(err)
      })
  })
})