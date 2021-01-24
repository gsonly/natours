const { Review } = require('../models')
const { deleteOne, updateOne, createOne, getOne, getAll } = require('./factory')

exports.setIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.id
  if (!req.body.user) req.body.user = req.user._id
  next()
}

exports.getReviews = getAll(Review)
exports.getReview = getOne(Review)
exports.createReview = createOne(Review)
exports.updateReview = updateOne(Review)
exports.deleteReview = deleteOne(Review)
