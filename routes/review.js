const { Router } = require('express')
const {
  getReviews,
  createReview,
  protect,
  restrict,
} = require('../controllers')

const router = Router({ mergeParams: true })

router.route('/').get(getReviews).post(protect, restrict('user'), createReview)

module.exports = router
