const { User } = require('../models')
const { catchAsync } = require('../utils')

exports.getUsers = catchAsync(async (req, res) => {
  const users = await User.find({})
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  })
})

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'not implemented',
  })
}

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'not implemented',
  })
}

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'not implemented',
  })
}

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'not implemented',
  })
}
