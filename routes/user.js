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
} = require('../controllers')

const router = Router()

router.route('/signup').post(signup)
router.route('/login').post(login)
router.route('/forgotPassword').post(forgotPassword)
router.route('/updatePassword').patch(protect, updatePassword)
router.route('/resetPassword/:token').patch(resetPassword)
router.route('/').get(getUsers).post(createUser)
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)

module.exports = router
