const { Review } = require('../models')
const { catchAsync } = require('../utils')

exports.getReviews = catchAsync(async (req, res) => {
  const filter = {}
  if (req.params.id) filter.tour = req.params.id
  const reviews = await Review.find(filter)
  res.status(200).json({
    status: 'success',
    results: reviews.length + 1,
    data: { reviews },
  })
})

exports.createReview = catchAsync(async (req, res) => {
  const review = await Review.create({
    tour: req.params.id,
    user: `${req.user._id}`,
    ...req.body,
  })
  res.status(201).json({
    status: 'success',
    data: { review },
  })
})
