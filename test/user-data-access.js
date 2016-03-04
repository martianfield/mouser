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

  it('create user', (done) => {
    let db = null
    MongoClient.connect(uri)
      .then(database => {
        db = database
        mouser.use('db', db)
        mouser.use('collection', collection)
        return mouser.users.create({name:"Rory Bosio"})
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

  it('read users', (done) => {
    let db = null
    MongoClient.connect("mongodb://localhost:27017/mouser")
      .then(database => {
        db = database
        mouser.use('db', db)
        mouser.use('collection', collection)
        return mouser.users.all()
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