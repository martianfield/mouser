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

// exports
module.exports.downloads = downloads
module.exports.users = users
