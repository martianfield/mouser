'use strict'

const opt = { db: null}

const setDb = (db, collection) => {
  opt.db = db
  opt.collection = collection
}

const find = (filter) => {
  return opt.db.collection(opt.collection).find(filter).toArray()
}

const findOne = (filter) => {
  return opt.db.collection(opt.collection).find(filter).limit(1).next()
}

const create = (doc) => {
  return new Promise((resolve, reject) => {
    opt.db.collection(opt.collection).insertOne(doc)
      .then(result => {
        resolve(result.ops[0])
      })
      .catch(err => {
        reject(err)
    })
  })
}


module.exports.setDb = setDb
module.exports.find = find
module.exports.findOne = findOne
module.exports.create = create
module.exports.options = opt
