const { Router } = require('express')
const { getTours, getTour, createTour, updateTour, deleteTour, checkID, checkBody } = require('../controllers')

const router = Router()

router.param('id', checkID)

router.route('/').get(getTours).post(checkBody, createTour)

router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour)

module.exports = router
