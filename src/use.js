'use strict'

const UserDA = require(__dirname + '/user-da.js')
const Token = require(__dirname + '/token.js')
const Facebook = require(__dirname + '/auth-facebook.js')
const Google = require(__dirname + '/auth-google.js')

function use(target, values) {
  // TODO for some reason rest args do not work ... hence the nasty pre 2015 workaround below
  target = target.toLowerCase().trim()
  var values = Array.prototype.slice.call(arguments, use.length - 1);
  switch(target) {
    case 'db':
      UserDA.O.db = values[0]
      break
    case 'collection':
      UserDA.O.collection = values[0]
      break
    case 'token':
      Token.O.secret = values[0]
      Token.O.expiresIn = values[1]
      break
    case 'facebook':
      Facebook.O.appId = values[0]
      Facebook.O.secret = values[1]
      break
    case 'google':
      Google.O.appId = values[0]
      Google.O.secret = values[1]
      break

  }
}


module.exports.use = use

