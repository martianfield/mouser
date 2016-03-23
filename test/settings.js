'use strict'

const chai = require('chai')
const should = chai.should()
const expect = chai.expect

const mouser = require(__dirname + '/../index.js')
const use = require(__dirname + '/../src/use.js')
const userDA = require(__dirname + '/../src/user-da.js')
const settings = require(__dirname + '/../src/settings.js')
const facebook = require(__dirname + '/../src/auth-facebook.js')
const google = require(__dirname + '/../src/auth-google.js')
const google2 = require(__dirname + '/../src/auth-google.js')

describe("Settings", () => {
  it("use('db') and database settings" , () => {
    // arrange
    let pseudoDb = { mongo:"rocks" }
    let collection = 'users_test'
    // act
    settings.database.collection = collection
    mouser.use('db', pseudoDb)
    // assert
    expect(userDA.db()).to.not.equal(null)
    expect(settings.database.collection).to.not.equal(null)
    expect(userDA.db()).to.deep.equal(pseudoDb)
    expect(settings.database.collection).to.deep.equal(collection)
  })


})