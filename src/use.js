'use strict'

const UserDAO = require(__dirname + '/user-dao.js').UserDAO
const daos = {}

const use = (target, value) => {
  target = target.toLowerCase().trim()
  switch(target) {
    case 'db':
      console.log("using 'db'")
      console.log("creating DAOs")
      daos.user = new UserDAO(value)
      break
  }
}

module.exports.use = use
