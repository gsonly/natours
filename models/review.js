const mongoose = require('mongoose')
const Tour = require('./tour')

let Review

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'review cannot be empty!'],
      trim: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'review must belong to a user'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

reviewSchema.index({ tour: 1, user: 1 }, { unique: true })

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  })
  next()
})

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRatings: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ])
  if (stats.length > 0) {
    const rInfo = stats[0]
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: rInfo.avgRating,
      ratingsQuantity: rInfo.nRatings,
    })
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: 4.5,
      ratingsQuantity: 0,
    })
  }
}

reviewSchema.post('save', async function () {
  await Review.calcAverageRatings(this.tour)
})

reviewSchema.post(/^findOneAnd/, async doc => {
  await Review.calcAverageRatings(doc.tour)
})

Review = mongoose.model('Review', reviewSchema)

module.exports = Review
