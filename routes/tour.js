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
  getToursWithin,
  getDistances,
  // createReview,
} = require('../controllers')

const router = Router()

router.use('/:id/reviews', reviewRouter)
router
  .route('/')
  .get(getTours)
  .post(protect, restrict('admin', 'lead-guide'), createTour)
router.route('/top-5-cheap').get(aliasTopTours, getTours)
router.route('/tour-stats').get(getTourStats)
router
  .route('/monthly-plan/:year')
  .get(protect, restrict('admin', 'lead-guide', 'guide'), getMonthlyPlan)
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithin)
router.route('/distances/:latlng/unit/:unit').get(getDistances)
router
  .route('/:id')
  .get(getTour)
  .patch(protect, restrict('admin', 'lead-guide'), updateTour)
  .delete(protect, restrict('admin', 'lead-guide'), deleteTour)
// router.route('/:id/reviews').post(protect, restrict('user'), createReview)

module.exports = router
