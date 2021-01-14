const jwt = require('jsonwebtoken')
const { User } = require('../models')
const { catchAsync, AppError } = require('../utils')
const { JWT_SECRET, JWT_TIMEOUT } = require('../config')

const signJWT = id =>
  jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_TIMEOUT,
  })

exports.signup = catchAsync(async (req, res) => {
  const user = await User.create(req.body)

  const token = signJWT(user._id)

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user,
    },
  })
})

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password)
    return next(new AppError('please provide email and password', 400))

  const user = await User.findOne({ email }).select('+password')

  if (!user || !(await user.verifyPassword(password)))
    return next(new AppError('invalid email or password', 401))

  const token = signJWT(user._id)

  res.status(200).json({
    status: 'success',
    token,
  })
})
