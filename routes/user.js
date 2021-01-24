const { Router } = require('express')
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  createUser,
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
  updateMe,
  deleteMe,
  getMe,
} = require('../controllers')

const router = Router()

router.route('/signup').post(signup)
router.route('/login').post(login)
router.route('/forgotPassword').post(forgotPassword)
router.route('/updatePassword').patch(protect, updatePassword)
router.route('/updateMe').patch(protect, updateMe)
router.route('/deleteMe').patch(protect, deleteMe)
router.route('/resetPassword/:token').patch(resetPassword)
router.route('/').get(getUsers).post(createUser)
router.route('/me').get(protect, getMe, getUser)
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)

module.exports = router
