const { Router } = require('express')
const {
  getReviews,
  createReview,
  protect,
  restrict,
  deleteReview,
  updateReview,
  setIds,
  getReview,
} = require('../controllers')

const router = Router({ mergeParams: true })

router
  .route('/')
  .get(getReviews)
  .post(protect, restrict('user'), setIds, createReview)
router.route('/:id').get(getReview).delete(deleteReview).patch(updateReview)

module.exports = router
