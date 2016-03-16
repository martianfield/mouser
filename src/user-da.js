'use strict'

const settings = require(__dirname + '/settings.js')
const roles = require(__dirname + '/roles.js')
const o = { db: null}


const init = (database) => {
  o.db = database
}

const find = (filter) => {
  return o.db.collection(settings.database.collection).find(filter).toArray()
}

const findOne = (filter) => {
  return o.db.collection(settings.database.collection).find(filter).limit(1).next()
}

const findOrCreate = (user) => {
  return new Promise((resolve, reject) => {
    findOne({"auth.provider":user.auth.provider, "auth.id":user.auth.id})
      .then(found => {
        if(found === null) {
          return create(user)
        }
        else {
          resolve(found)
        }
      })
      .then(created => {
        resolve(created)
      })
      .catch(err => {
        reject(err)
      })
  })
}

const create = (user) => {
  // we receive the user without the roles[] array from the callback
  if(user.hasOwnProperty('roles') === false) {
    user.roles = []
  }
  return new Promise((resolve, reject) => {
    o.db.collection(settings.database.collection).insertOne(user)
      .then(result => {
        resolve(result.ops[0])
      })
      .catch(err => {
        reject(err)
    })
  })
}

const addRole = (user, role) => {
  return new Promise((resolve, reject) => {
    if(roles.hasRole(user, role)) {
      // user already has the role
      resolve(false)
    }
    else {
      // add the role to roles array
      roles.addRole(user, role)
      // save the user document to mongo
      o.db.collection(settings.database.collection).updateOne({_id:user._id}, {$set:{roles:user.roles}})
        .then(result => {
          resolve(result.modifiedCount === 1)
        })
        .catch(err => {
          reject(err)
        })
    }
  })

}


module.exports.init = init
module.exports.find = find
module.exports.findOne = findOne
module.exports.create = create
module.exports.findOrCreate = findOrCreate
module.exports.addRole = addRole

module.exports.db = () => o.db // TODO do we really need to export this?
