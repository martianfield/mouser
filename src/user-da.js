'use strict'

/**
 * Data access object for users collection
 * @param database
 * @constructor
 */
function UserDAO() {
  this.db = null
  this.collection = null

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

module.exports.O = new UserDAO()