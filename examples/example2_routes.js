'use strict'

const mouser = require(__dirname + '/../index.js')
const express = require('express')

// use options to tell mouser which method is open / closed to which role(s)
// use '*' to indicate a wildcard (for both, method and role)
let opts = [
  {"GET": "*"},
  {"POST, PUT, DELETE": "admin, superuser"}
]

// create middleware that opens or closes routes
let mw = mouser.protect(opts)

// then use this middleware
let route = express.Router()
route.use(mw)
route.get('/', (req, res) => { res.send("Hello") })

// Alright, here two actual examples

// the news route - everybody can get news, only admins can post
let news = express.Router()

news.use(mouser.protect([
  {"GET": "*"},
  {"POST": "admin"}
]))
news.get('/', (req, res) => {
  res.send("NEWS - GET")
})
news.post('/', (req, res) => {
  res.send("NEWS - POST")
})

// the downloads route - only members and admins can view, only admins can post
let downloads = express.Router()
downloads.use(mouser.protect([
  {"GET": "member, admin"},
  {"POST": "admin"}
]))

downloads.get('/', (req, res) => {
  res.send("DOWNLOADS - GET")
})
downloads.post('/', (req, res) => {
  res.send("DOWNLOADS - POST")
})


// exports
module.exports.news = news
module.exports.downloads = downloads
