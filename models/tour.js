const mongoose = require('mongoose')
const slugify = require('slugify')

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'a tour must have a name'],
      unique: true,
      maxlength: [40, 'a tour name must have less or equal than 40 characters'],
      minlength: [10, 'a tour name must have more or equal than 10 characters'],
    },
    duration: {
      type: Number,
      required: [true, 'a tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'a tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'a tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'difficulty is either easy, medium or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'rating must be above 1.0'],
      max: [5, 'rating must be below 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'a tour must have a price'],
    },
    discount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price
        },
        message: 'discount price {VALUE} must be less that a regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'a tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'a tour must have a cover image'],
    },
    images: [String],
    startDates: [Date],
    slug: String,
    isSecret: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7
})

tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
})

tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true })
  next()
})

tourSchema.pre(/^find/, function (next) {
  this.find({ isSecret: { $ne: true } })
  next()
})

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  })
  next()
})

tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isSecret: { $ne: true } } })
  next()
})

module.exports = mongoose.model('Tour', tourSchema)
