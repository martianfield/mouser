'use strict'

const _ = require('lodash')
const chai = require('chai')
const should = chai.should()
const expect = chai.expect

const mouser = require(__dirname + '/../index.js')


describe('Configure', () => {
  let validConfiguration = {
    db: { userCollection:'users'},
    session: { secret:"asdfghjkl", expiresIn:123456789, cookieName:'cats'},
    token: { secret:"qwertzuiop", expiresIn:123456789},
    providers: {
      facebook:{appSecret:"qwertz", appId:"ertzui"},
      google:{appSecret:"qwertz", appId:"ertzui"}
    },
    paths: {
      base: "http://qwertzu", login: "login", logout: "logout"
    }
  }

  it('complete', () => {
    // arrange
    let settings = _.cloneDeep(validConfiguration)
    // act
    let result = mouser.configure(settings)
    // assert
    expect(result).to.equal(true)
    expect(mouser.configuration).to.deep.equal(settings)
  })

  it('defaults', () => {
    // defaults:
    // - paths.login : "login"
    // - paths.logout : "logout"
    // - session.expiresIn: 20160
    // - token.expiresIn: 20160
    // arrange
    let settings = {
      db: { userCollection:'users'},
      session: { secret:"asdfghjkl"},
      token: { secret:"qwertzuiop"},
      providers: {
        facebook:{appSecret:"qwertz", appId:"ertzui"},
        google:{appSecret:"qwertz", appId:"ertzui"}
      },
      paths: {
        base: "http://qwertzu"
      }
    }
    // act
    let result = mouser.configure(settings)
    // assert
    expect(result).to.equal(true)
  })

  it('defaults overwritten by user settings', () => {
    // arrange
    let settings = validConfiguration
    // act
    mouser.configure(settings)
    // assert
    expect(mouser.configure.configuration.session.expiresIn).to.equal(validConfiguration.session.expiresIn)
  })
  
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


  it('no provider supplied', () => {
    // The configuration should be valid even if there is no provider provided (forgive me the pun)
    // There should, however, be a warning
    // arrange
    let settings = _.cloneDeep(validConfiguration)
    settings.providers = {}
    // act
    let result = mouser.configure(settings)
    let errors = mouser.configure.errors
    let warnings = mouser.configure.warnings
    // assert
    expect(result).to.equal(true)
    expect(errors.length).to.equal(0)
    expect(warnings).to.have.length.above(0)
  })

})