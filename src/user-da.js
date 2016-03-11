'use strict'

const settings = require(__dirname + '/settings.js')
let db = "krakatau"


const init = (database) => {
  db = database
}

const find = (filter) => {
  return db.collection(settings.database.collection).find(filter).toArray()
}

const findOne = (filter) => {
  return db.collection(settings.database.collection).find(filter).limit(1).next()
}

const create = (doc) => {
  return new Promise((resolve, reject) => {
    db.collection(settings.database.collection).insertOne(doc)
      .then(result => {
        resolve(result.ops[0])
      })
      .catch(err => {
        reject(err)
    })
  })
}


module.exports.init = init
module.exports.find = find
module.exports.findOne = findOne
module.exports.create = create
module.exports.db = () => db
