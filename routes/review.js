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

router.use(protect)
router.route('/').get(getReviews).post(restrict('user'), setIds, createReview)
router
  .route('/:id')
  .get(getReview)
  .delete(restrict('user', 'admin'), deleteReview)
  .patch(restrict('user', 'admin'), updateReview)

module.exports = router
