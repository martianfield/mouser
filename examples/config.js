const settings = {
  paths: {
    base: 'http://localhost:8080'
  },
  providers: {
    facebook: {
      appId: "1263998553617347",
      appSecret: "e783b181f16e132754c56ba2bf79f890"
    },
    google: {
      appId: "322967781676-i5d3tqh3uja2hm31q61onoafn486cgfj.apps.googleusercontent.com",
      appSecret: "vw4GDz3jT21iMFScW95LQfE9"
    }
  },
  token: {
    secret: "this_is_my_secret",
    expiresIn: 7 * 24 * 60 * 60
  },
  session: {
    secret: "this_is_my_secret",
    expiresIn: 7 * 24 * 60 * 60
  },
  db: {
    userCollection:'users'
  }
}

module.exports = settings

