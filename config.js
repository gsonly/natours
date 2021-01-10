const {
  NODE_ENV = 'development',
  APP_PORT = 3000,
  MONGO_USERNAME = 'admin',
  MONGO_PASSWORD = 'secret',
  MONGO_HOST = 'localhost',
  MONGO_PORT = 27017,
  MONGO_DATABASE = 'natours',
} = process.env

const IN_PROD = NODE_ENV === 'production'

const MONGO_URI = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`

const MONGO_OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
}

module.exports = {
  NODE_ENV,
  APP_PORT,
  IN_PROD,
  MONGO_URI,
  MONGO_OPTIONS,
}
