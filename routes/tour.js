const { Router } = require('express')
const reviewRouter = require('./review')
const {
  getTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
  protect,
  restrict,
  // createReview,
} = require('../controllers')

const router = Router()

router.route('/').get(getTours).post(createTour)
router.route('/top-5-cheap').get(aliasTopTours, getTours)
router.route('/tour-stats').get(getTourStats)
router.route('/monthly-plan/:year').get(getMonthlyPlan)
router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(protect, restrict('admin', 'lead-guide'), deleteTour)
router.use('/:id/reviews', reviewRouter)
// router.route('/:id/reviews').post(protect, restrict('user'), createReview)

module.exports = router
