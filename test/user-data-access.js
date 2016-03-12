'use strict'

const chai = require('chai')
const should = chai.should()
const expect = chai.expect

const mouser = require(__dirname + '/../index.js')
const use = require(__dirname + '/../src/use.js')
const userDA = require(__dirname + '/../src/user-da.js')
const MongoClient = require('mongodb').MongoClient
const settings = require(__dirname + '/../src/settings.js')

describe("User Data Access", () => {
  settings.database.collection = 'users_test'
  let uri = "mongodb://localhost:27017/mouser"
  let db = null

  before(done => {
    MongoClient.connect(uri)
      .then(database => {
        db = database
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  after(done => {
    db.collection(settings.database.collection).drop()
      .then(result => {
        db.close()
        done()
      })
      .catch(err => {
        db.close()
        done(err)
      })
  })

  it('create()', (done) => {
    let db = null
    MongoClient.connect(uri)
      .then(database => {
        db = database
        mouser.use('db', db)
        return userDA.create({name:"Rory Bosio"})
      })
      .then(doc => {
        expect(doc.name).to.equal('Rory Bosio')
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('find()', (done) => {
    let db = null
    MongoClient.connect(uri)
      .then(database => {
        db = database
        mouser.use('database', db)
        return userDA.find({})
      })
      .then(docs => {
        let doc = docs[0]
        expect(doc.name).to.equal('Rory Bosio')
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('findOrCreate() - one', (done) => {
    // arrange
    let db = null
    let user = {firstName:"Test", auth:{provider:'facebook', id:Date.now()}}
    // act
    MongoClient.connect("mongodb://localhost:27017/mouser")
      .then(database => {
        db = database
        mouser.use('database', db)
        return userDA.findOrCreate(user)
      })
      .then(doc => {
        expect(doc.auth.id).to.equal(user.auth.id)
        expect(doc._id).to.not.equal(null)
        // now try to get it again
        return userDA.findOne({"auth.provider":user.auth.provider, "auth.id":user.auth.id})
      })
      .then(doc => {
        expect(doc.auth.id).to.equal(user.auth.id)
        done()
      })
      .catch(err => {
        done(err)
      })
  })
})