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
  restrict,
} = require('../controllers')

const router = Router()

router.route('/signup').post(signup)
router.route('/login').post(login)
router.route('/forgotPassword').post(forgotPassword)
router.route('/resetPassword/:token').patch(resetPassword)
router.use(protect)
router.route('/updatePassword').patch(updatePassword)
router.route('/updateMe').patch(updateMe)
router.route('/deleteMe').patch(deleteMe)
router.route('/me').get(getMe, getUser)
router.use(restrict('admin'))
router.route('/').get(getUsers).post(createUser)
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)

module.exports = router
