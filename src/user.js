'use strict'

function User(o) {
  // props
  let props = ['_id', 'id', 'firstName', 'lastName', 'middleName', 'displayName']
  props.forEach(prop => {
    this[prop] = o.hasOwnProperty(prop) ? o[prop] : null
  })
  // authentication prop
  this.authentication = {provider:null, id:null}
  if(o.hasOwnProperty('authentication')) {
    let auth_props = ['provider', 'id']
    auth_props.forEach(prop => {
      this.authentication[prop] = o.authentication.hasOwnProperty(prop) ? o.authentication[prop] : null
    })
  }
}


module.exports = User