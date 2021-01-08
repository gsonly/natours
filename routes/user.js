const { Router } = require('express')
const { getUsers, getUser, updateUser, deleteUser, createUser } = require('../controllers')

const router = Router()

router.route('/').get(getUsers).post(createUser)

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)

module.exports = router
