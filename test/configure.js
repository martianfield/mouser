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
    // assert
    expect(result).to.equal(false)
  })
})