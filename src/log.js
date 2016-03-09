const options = { silent: true }


const log = (message) => {
  if(options.silent === false) {
    console.log(message)
  }
}

module.exports = log
module.exports.options = options