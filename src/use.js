'use strict'

const UserDA = require(__dirname + '/user-da.js')


const use = (target, value) => {
  target = target.toLowerCase().trim()
  switch(target) {
    case 'db':
      UserDA.O.db = value
      break
    case 'collection':
      UserDA.O.collection = value
      break
  }
}


module.exports.use = use
