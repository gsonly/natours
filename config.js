const {
  NODE_ENV = 'development',
  APP_PORT = 3000,
  MONGO_USERNAME = 'admin',
  MONGO_PASSWORD = 'secret',
  MONGO_HOST = 'localhost',
  MONGO_PORT = 27017,
  MONGO_DATABASE = 'natours',
  JWT_SECRET = 'secret',
  JWT_TTL = '90d',
  COOKIE_TTL = '90',
  EMAIL_HOST = 'localhost',
  EMAIL_PORT = 2525,
  EMAIL_USER = 'user',
  EMAIL_PASS = 'secret',
  EMAIL_FROM = 'gladson.sethiel@gmail.com',
  SENDGRID_USERNAME = 'admin',
  SENDGRID_PASSWORD = 'secret',
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
  JWT_SECRET,
  JWT_TTL,
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_USER,
  EMAIL_PASS,
  EMAIL_FROM,
  COOKIE_TTL,
  SENDGRID_USERNAME,
  SENDGRID_PASSWORD,
}
