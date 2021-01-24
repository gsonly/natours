const mongoose = require('mongoose')

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

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  })
  next()
})

module.exports = mongoose.model('Review', reviewSchema)
