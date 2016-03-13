const settings = {
  reset: reset
}

function reset() {
  settings.token = { secret: null, expiresIn:10*24*60 }
  settings.session = { secret: null, expiresIn:10*24*60, cookieName: 'mouser' }
  settings.providers = {}
  settings.providers.facebook = { appId:null, appSecret:null, active:false }
  settings.providers.google = { appId:null, appSecret:null, active:false }
  settings.paths = { base:'http://localhost:8080', login:'login', logout:'logout' }
  settings.database = {
    collection: 'users'
  }
}

settings.reset()
module.exports = settings
