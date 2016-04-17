'use strict'

const mouser = require(__dirname + '/../index.js')
const express = require('express')

// the downloads route has all methods protected
let downloads = express.Router()
downloads.use(mouser.protectRoute({}))
downloads.get('/', (req, res) => {
  res.send("Downloads - GET")
})
downloads.post('/', (req, res) => {
  res.send("Downloads - POST")
})

// the user route allows any visitor to use the get method
let users = express.Router()
users.use(mouser.protectRoute({allow:["GET"]}))
users.get('/', (req, res) => {
  res.send("Users - GET")
})
users.post('/', (req, res) => {
  res.send("Users - POST")
})

// use options to tell mouser which method is open / closed to which role(s)
// use '*' to indicate a wildcard (for both, method and role)
let opts = [
  {"GET": "*"},
  {"POST, PUT, DELETE": "admin, superuser"}
]

// create middleware that opens or closes routes
let mw_1 = mouser.openRoute({ opts })
let mw_2 = mouser.closeRoute({ opts })

// then use that middleware on the route
users.use(mw_1)
downloads.use(mw_2)


// exports
module.exports.downloads = downloads
module.exports.users = users
