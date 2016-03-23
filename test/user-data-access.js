'use strict'

const chai = require('chai')
const should = chai.should()
const expect = chai.expect

const mouser = require(__dirname + '/../index.js')
const userDA = require(__dirname + '/../src/user-da.js')
const MongoClient = require('mongodb').MongoClient

describe("User Data Access", () => {
  mouser.configuration["db"] = {userCollection:'users_test'}
  let uri = "mongodb://localhost:27017/mouser"
  let db = null

  before(done => {
    MongoClient.connect(uri)
      .then(database => {
        mouser.use('db', database)
        db = database
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  after(done => {
    db.collection(mouser.configuration.db.userCollection).drop()
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
    userDA.create({name:"Rory Bosio"})
      .then(doc => {
        expect(doc.name).to.equal('Rory Bosio')
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('find()', (done) => {
    userDA.find({})
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
    let user = {firstName:"Test", auth:{provider:'facebook', id:Date.now()}}
    userDA.findOrCreate(user)
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

  it('addRole()', (done) => {
    let user = {'firstName': 'Test'}
    let roleToAdd = 'pacer'
    userDA.create(user)
    .then(createdUser => {
      user = createdUser
      return userDA.addRole(createdUser, roleToAdd)
    })
    .then(roleAdded => {
      expect(roleAdded).to.equal(true)
      return userDA.findOne({_id:user._id})
    })
    .then(foundUser => {
      expect(foundUser.roles).to.contain(roleToAdd)
      done()
    })
    .catch(err => {
      done(err)
    })
  })

  it('removeRole()', (done) => {
    let user = {'firstName': 'Test', roles: ['one', 'two', 'three']}
    let roleToRemove = 'one'
    userDA.create(user)
      .then(createdUser => {
        user = createdUser
        return userDA.removeRole(createdUser, roleToRemove)
      })
      .then(roleRemoved => {
        expect(roleRemoved).to.equal(true)
        return userDA.findOne({_id:user._id})
      })
      .then(foundUser => {
        expect(foundUser.roles).to.not.contain(roleToRemove)
        expect(foundUser.roles.length).to.equal(2)
        done()
      })
      .catch(err => {
        done(err)
      })
  })
})