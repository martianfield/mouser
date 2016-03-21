'use strict'

const chai = require('chai')
const should = chai.should()
const expect = chai.expect

const mouser = require(__dirname + '/../index.js')


describe('Configure', () => {
  it('empty configuration', () => {
    // arrange
    let settings = {}
    // act
    let result = mouser.configure(settings)
    let errors = mouser.configure.errors
    // assert
    expect(result).to.equal(false)
    expect(errors).to.have.length.above(0)
  })
})