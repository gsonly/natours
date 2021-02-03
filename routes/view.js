const { Router } = require('express')
const {
  getOverview,
  getTour,
  getLogin,
  isLoggedIn,
  getAccount,
  protect,
  updateUserData,
} = require('../controllers')

const router = Router()

router.route('/').get(isLoggedIn, getOverview)
router.route('/tour/:slug').get(isLoggedIn, getTour)
router.route('/login').get(isLoggedIn, getLogin)
router.route('/me').get(protect, getAccount)
router.route('/submitData').post(protect, updateUserData)

module.exports = router
