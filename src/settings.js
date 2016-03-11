const settings = {
  paths: {
    base:'http://localhost:8080',
    login:'login'
  },
  providers: {
    facebook : {
      appId:null,
      appSecret:null
    },
    google: {
      appId:null,
      appSecret:null
    }
  },
  token: {
    secret: null,
    expiresIn: 10*24*60
  },
  session: {
    secret: null,
    expiresIn: 10*24*60
  },
  database: {
    collection: 'users'
  }
}

module.exports = settings
