const { Router } = require('express')
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
} = require('../controllers')

const router = Router()

router.route('/').get(protect, getTours).post(createTour)
router.route('/top-5-cheap').get(aliasTopTours, getTours)
router.route('/tour-stats').get(getTourStats)
router.route('/monthly-plan/:year').get(getMonthlyPlan)
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour)

module.exports = router
