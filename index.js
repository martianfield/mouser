'use strict'

const use = require(__dirname + '/src/use.js')
const UserDA = require(__dirname + '/src/user-da.js')

module.exports.use = use.use


module.exports.info = () => {
  console.log("Mouser Info")
  console.log(`- user DAO db: ${UserDA.O.db}`)
  console.log(`- user DAO collection: ${UserDA.O.collection}`)
}