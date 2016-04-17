'use strict'

const chai = require('chai')
const should = chai.should()
const expect = chai.expect

const middleware = require(__dirname + '/../src/middleware')

describe('Middleware', () => {
  describe('parseOptions', () => {
    it('One-to-one', () => {
      // arrange
      let opts = [
        {"GET":"*"},
        {"POST":"admin"}
      ]
      // act
      let parsed = middleware.parseOptions(opts)
      //assert
      expect(parsed.GET.has('*')).to.be.true
      expect(parsed.POST.has('admin')).to.be.true
      expect(parsed.GET.has('admin')).to.be.false
      expect(parsed.POST.has('*')).to.be.false

    })

    it("One-to-many", () => {
      // arrange
      let opts = [
        {"GET": "admin,user,customer"}
      ]
      // act
      let parsed = middleware.parseOptions(opts)
      // assert
      expect(parsed.GET.has('admin')).to.be.true
      expect(parsed.GET.has('user')).to.be.true
      expect(parsed.GET.has('customer')).to.be.true
      expect(parsed.GET.has('jabberwocky')).to.be.false
    })

    it("Many-to-One", () => {
      // arrange
      let opts = [
        {"POST,PUT,DELETE":"user"}
      ]
      // act
      let parsed = middleware.parseOptions(opts)
      // assert
      expect(parsed.POST.has('user')).to.be.true
      expect(parsed.PUT.has('user')).to.be.true
      expect(parsed.DELETE.has('user')).to.be.true
    })

    it("Many-to-Many", () => {
      // arrange
      let opts = [
        {"POST, PUT": "user,admin"}
      ]
      // act
      let parsed = middleware.parseOptions(opts)
      // assert
      expect(parsed.POST.has('user')).to.be.true
      expect(parsed.POST.has('admin')).to.be.true
      expect(parsed.PUT.has('user')).to.be.true
      expect(parsed.PUT.has('admin')).to.be.true
    })

    it('not an array', () => {

    })
  })

  describe('makeCheckAccess', () => {
    it("One-to-One Simple", () => {
      // arrange
      let opts = [
        {"GET": "admin"}
      ]
      // act
      let checkAccess = middleware.makeCheckAccess(opts)
      // assert
      checkAccess("GET", "admin").should.be.true
      checkAccess("GET", "user").should.be.false
      checkAccess("POST", "admin").should.be.false
    })

    it("One-to-One with wildcard roles", () => {
      // arrange
      let opts = [
        {"GET": "*"}
      ]
      // act
      let checkAccess = middleware.makeCheckAccess(opts)
      // assert
      checkAccess("GET", "admin").should.be.true
      checkAccess("GET", "").should.be.true
      checkAccess("GET", undefined).should.be.true
    })
  })
})
