const { Router } = require('express')
const { getOverview, getTour, getLogin, isLoggedIn } = require('../controllers')

const router = Router()

router.use(isLoggedIn)
router.route('/').get(getOverview)
router.route('/tour/:slug').get(getTour)
router.route('/login').get(getLogin)

module.exports = router
