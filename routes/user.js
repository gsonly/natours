const { Router } = require('express')
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  createUser,
  signup,
  login,
} = require('../controllers')

const router = Router()

router.route('/signup').post(signup)

router.route('/login').post(login)

router.route('/').get(getUsers).post(createUser)

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)

module.exports = router
