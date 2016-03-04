'use strict'

const settings = {
  facebook: {
    id: null,
    secret: null
  },
  google: {
    id: null,
    secret: null
  },
  token: {
    secret: null,
    expiresIn: 0
  },
  mongo: {
    uri: null,
    userCollection: null
  }
}

const set = (target, options) => {
  target = target.toLowerCase()
  switch (target) {
    case 'facebook':
      settings.facebook.id = options.id
      settings.facebook.secret = options.secret
      break
    case 'google':
      settings.google.id = options.id
      settings.google.secret = options.secret
      break
    case 'token':
      settings.token.secret = options.secret
      settings.token.expiresIn = options.expiresIn
      break
    case 'mongo':
      settings.mongo.uri = options.uri
      break
  }
}
module.exports.settings = settings
module.exports.set = set
