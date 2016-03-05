'use strict'

const chai = require('chai')
const should = chai.should()
const expect = chai.expect

const mouser = require(__dirname + '/../index.js')
const roles = require(__dirname + '/../src/roles.js')

describe("User Roles", () => {
  it('hasRole', () => {
    // arrange
    let user = {roles:["one", "two", "three"]}
    // act
    let yes = mouser.hasRole(user, "ONE")
    let no = mouser.hasRole(user, "four")
    // assert
    expect(yes).to.equal(true)
    expect(no).to.equal(false)
  })

  it('addRole', () => {
    // arrange
    let role_to_add = "two"
    let user_a = { roles: ["one"] }
    let user_b = { roles: ["two", "three"] }
    // act
    mouser.addRole(user_a, role_to_add)
    mouser.addRole(user_b, role_to_add)
    // assert
    user_a.roles.length.should.equal(2)
    user_b.roles.length.should.equal(2)
    mouser.hasRole(user_a, role_to_add).should.equal(true)
    mouser.hasRole(user_b, role_to_add).should.equal(true)
  })

  it('removeRole', () => {
    // arrange
    let role_to_remove = "two"
    let user_a = { roles: ["one"] }
    let user_b = { roles: ["two", "three"] }
    // act
    mouser.removeRole(user_a, role_to_remove)
    mouser.removeRole(user_b, role_to_remove)
    // assert
    user_a.roles.length.should.equal(1)
    user_b.roles.length.should.equal(1)
    mouser.hasRole(user_a, role_to_remove).should.equal(false)
    mouser.hasRole(user_b, role_to_remove).should.equal(false)
  })
})