const { NODE_ENV = 'development', APP_PORT = 3000 } = process.env

const IN_PROD = NODE_ENV === 'production'

module.exports = {
  NODE_ENV,
  APP_PORT,
  IN_PROD,
}
