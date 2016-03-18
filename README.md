# MOUSER

User management and (social) user authentication with MongoDB.


## Settings

```javascript
mouser.set('facebook', { id:'facebook_app_id', secret:'facebook_app_secret'} )
mouser.set('google', { id:'google_app_id', secret:'google_app_secret'} )
mouser.set('token', { secret:'token_secret', expiresIn: 9999} )
mouser.set('mongo', { uri:'mongo_uri', userCollection:'users'} )
```