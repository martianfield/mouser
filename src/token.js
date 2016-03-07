'use strict'

function Token() {
  this.expiresIn = 7 * 24 * 60 * 60 // a week
  this.secret = 'no_secret'
}


const O = new Token()
module.exports.O = O