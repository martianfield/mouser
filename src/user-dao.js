'use strict'

/**
 * Data access object for users collection
 * @param database
 * @constructor
 */
function UserDAO(database) {
  console.log("User DataAccessObject initialized")
  this.db = database

  /**
   * Returns all users
   * @returns {Promise}
   */
  this.all = function() {
    return this.db.collection('users').find({}).toArray()
  }

  /**
   * Returns a user by id
   * @param id
   * @returns {Promise}
   */
  this.oneById = function(id) {
    return this.db.collection('users').find({"id":id}).limit(1).next()
  }

}

module.exports.UserDAO = UserDAO