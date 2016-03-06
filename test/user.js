'use strict'

const chai = require('chai')
const should = chai.should()
const expect = chai.expect

const mouser = require(__dirname + '/../index.js')


describe("User", () => {
  it("Create User object", () => {
    // arrange
    let p = { firstName: "Peter", lastName:"Smith", middleName:"Hammer", "authentication":{provider:"facebook", id:"123"}}
    // act
    let u = new mouser.User(p)
    // assert
    expect(u.firstName).to.equal(p.firstName)
    expect(u.lastName).to.equal(p.lastName)
    expect(u.middleName).to.equal(p.middleName)
    expect(u.authentication.provider).to.equal(p.authentication.provider)
    expect(u.authentication.id).to.equal(p.authentication.id)
  })
})