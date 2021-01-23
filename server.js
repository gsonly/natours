const mongoose = require('mongoose')
const app = require('./app')
const { APP_PORT, MONGO_URI, MONGO_OPTIONS } = require('./config')

;(async () => {
  try {
    await mongoose.connect(MONGO_URI, MONGO_OPTIONS)
    app.listen(APP_PORT, console.log(`http://localhost:${APP_PORT}`))
  } catch (err) {
    console.log(err)
  }
})()
