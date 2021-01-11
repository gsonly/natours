const { Router } = require('express')
const {
  getTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
} = require('../controllers')

const router = Router()

router.route('/').get(getTours).post(createTour)

router.route('/top-5-cheap').get(aliasTopTours, getTours)

router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour)

module.exports = router
