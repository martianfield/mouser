'use strict'

/**
 * Data access object for users collection
 * @param database
 * @constructor
 */
function UserDAO() {
  this.db = null
  this.collection = null

  this.create = (doc) => {
    return new Promise((resolve, reject) => {
      this.db.collection(this.collection).insertOne(doc)
        .then(result => {
          resolve(result.ops[0])
        })
        .catch(err => {
          reject(err)
        })
    })

  }

  /**
   * Returns all users
   * @returns {Promise}
   */
  this.all = function() {
    return this.db.collection(this.collection).find({}).toArray()
  }

  /**
   * Returns a user by id
   * @param id
   * @returns {Promise}
   */
  this.oneById = function(id) {
    return this.db.collection(this.collection).find({"id":id}).limit(1).next()
  }

  this.info = function() {
    console.log("UserDAO Info")
    console.log(`- collection: ${this.collection}`)
  }

}

const O = new UserDAO()
module.exports.O = O