'use strict'

const app = require('express')()
const session = require('client-sessions')
const mouser = require(__dirname + '/../index.js')

const port = process.env.PORT || 8080

// set up mouser (hooks up middleware like client-session)
mouser.use('app', app)

// hook up middleware at application level
app.use(mouser.requireLogin)


// basic route
app.get('/', (req, res) => {
  res.send("Hello world. ")
})

// run server
app.listen(port)
console.log(`serving at http://localhost:${port}`)


// ..................




// see here: https://stormpath.com/blog/everything-you-ever-wanted-to-know-about-node-dot-js-sessions/


