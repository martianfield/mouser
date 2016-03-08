'use strict'

const app = require('express')()
const session = require('client-sessions')
const mouser = require(__dirname + '/../index.js')

const port = process.env.PORT || 8080

// tell mouser which app to use
mouser.use('app', app)

// require login on the all URIs starting with the the paths given
mouser.protect(['/user', '/downloads'], true)


// basic route
app.get('/', (req, res) => {
  res.send("Hello world. ")
})

// last resort
app.use(function(req, res) {
  res.status(404).send('Sorry cant find that!');
});


// run server
app.listen(port)
console.log(`serving at http://localhost:${port}`)


// ..................




// see here: https://stormpath.com/blog/everything-you-ever-wanted-to-know-about-node-dot-js-sessions/


