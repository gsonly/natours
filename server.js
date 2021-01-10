const mongoose = require('mongoose')
const app = require('./app')
const { APP_PORT, MONGO_URI, MONGO_OPTIONS } = require('./config')

;(async () => {
  try {
    await mongoose.connect(MONGO_URI, MONGO_OPTIONS)

    const tourSchema = new mongoose.Schema({
      name: {
        type: String,
        required: [true, 'a tour must have a name'],
        unique: true,
      },
      rating: {
        type: Number,
        default: 4.5,
      },
      price: {
        type: Number,
        required: [true, 'a tour must have a price'],
      },
    })

    const Tour = mongoose.model('Tour', tourSchema)

    const testTour = new Tour({
      name: 'the forest hiker',
      price: 997,
      rating: 4.7,
    })

    await testTour.save()

    app.listen(APP_PORT, console.log(`http://localhost:${APP_PORT}`))
  } catch (err) {
    console.log(err)
  }
})()
