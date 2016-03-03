const config = require(__dirname + '/config.js')
const mouser = require(__dirname + '/../index.js')

// configuration
/*
mouser.set('facebook', { id: config.facebook.id, secret: config.facebook.secret} )
mouser.set('google', { id: config.google.id, secret: config.google.secret } )
mouser.set('token', { secret: config.token.secret, expiresIn: config.token.expiresIn } )
mouser.set('mongo', { uri: config.mongo.uri, userCollection: config.mongo.userCollection} )
*/
mouser.settings = config

console.log(mouser.settings)