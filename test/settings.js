'use strict'

const chai = require('chai')
const should = chai.should()
const expect = chai.expect

const mouser = require(__dirname + '/../index.js')
const use = require(__dirname + '/../src/use.js')
const userDA = require(__dirname + '/../src/user-da.js')
const token = require(__dirname + '/../src/token.js')
const facebook = require(__dirname + '/../src/auth-facebook.js')
const google = require(__dirname + '/../src/auth-google.js')
const google2 = require(__dirname + '/../src/auth-google.js')

describe("Settings", () => {
  it("Use 'db", () => {
    // arrange
    let pseudoDb = { mongo:"rocks" }
    let collection = 'customers'
    // act
    mouser.use('db', pseudoDb )
    mouser.use('collection', 'customers')
    // assert
    expect(userDA.O).to.not.equal(null)
    expect(userDA.O.db).to.not.equal(null)
    expect(userDA.O.collection).to.not.equal(null)
    expect(userDA.O.db).to.deep.equal(pseudoDb)
    expect(userDA.O.collection).to.deep.equal('customers')
  })

  it("Use 'token'", () => {
    // arrange
    let secret = "DoubleDoubleToilAndTrouble"
    let expiresIn = 30 * 24 * 60 * 60
    // act
    mouser.use('token', secret, expiresIn)
    // assert
    expect(token.O).to.not.equal(null)
    expect(token.O.secret).to.equal(secret)
    expect(token.O.expiresIn).to.equal(expiresIn)
  })

  it("Use 'facebook'", () => {
    // arrange
    let appId = '456fd78df6789df789'
    let secret = 'faceschmook'
    // act
    mouser.use('facebook', appId, secret)
    // assert
    expect(facebook.O).to.not.equal(null)
    expect(facebook.O.appId).to.equal(appId)
    expect(facebook.O.secret).to.equal(secret)
  })

  it("Use 'google'", () => {
    // arrange
    let appId = '456fd78df6789df789'
    let secret = 'schmoogle'
    // act
    mouser.use('google', appId, secret)
    // assert
    expect(google.O).to.not.equal(null)
    expect(google.O.appId).to.equal(appId)
    expect(google.O.secret).to.equal(secret)
  })


})