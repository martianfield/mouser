'use strict'

const _ = require('lodash')

const prepare = (user, role) => {
  this.role = role.toLowerCase().trim()
  this.user = user
  if(this.user.hasOwnProperty("roles") == false) {
    this.user.roles = []
  }
}

const hasRole = (user, role) => {
  prepare.call(this, user, role)
  return this.user.roles.some(element => element.toLowerCase().trim() === this.role)
}

const addRole = (user, role) => {
  if(hasRole(user, role)) {
    return
  }
  prepare.call(this, user, role)
  this.user.roles.push(role)
}

const removeRole = (user, role) => {
  prepare.call(this, user, role)
  let index = -1
  this.user.roles.some((element, idx) => {
    if(element.toLowerCase().trim() === this.role) {
      index = idx
      return true
    }
    else {
      return false
    }
  })
  if(index > -1) {
    this.user.roles.splice(index, 1)
    console.log(this.user.roles)
  }
}


module.exports.hasRole = hasRole
module.exports.addRole = addRole
module.exports.removeRole = removeRole