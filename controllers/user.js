const { User } = require('../models')
const { catchAsync } = require('../utils')
const { AppError } = require('../utils')

const filteredBody = (obj, ...fields) => {
  const filteredObj = {}
  Object.keys(obj).forEach(k => {
    if (fields.includes(k)) filteredObj[k] = obj[k]
  })
  return filteredObj
}

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

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm)
    throw new AppError('use /updatePassword for passwords', 400)
  const body = filteredBody(req.body, 'name', 'email')
  const user = await User.findByIdAndUpdate(req.user._id, body, {
    new: true,
    runValidators: true,
  })
  res.status(200).json({
    status: 'success',
    data: { user },
  })
})

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false })
  res.status(204).json({
    status: 'success',
    data: null,
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
