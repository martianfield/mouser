'use strict'

const chai = require('chai')
const should = chai.should()
const expect = chai.expect

const mouser = require(__dirname + '/../index.js')
const use = require(__dirname + '/../src/use.js')
const userDA = require(__dirname + '/../src/user-da.js')


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
})