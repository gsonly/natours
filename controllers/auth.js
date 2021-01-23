const { sign, verify } = require('jsonwebtoken')
const { promisify } = require('util')
const { User } = require('../models')
const { catchAsync, AppError } = require('../utils')
const { JWT_SECRET, JWT_TIMEOUT } = require('../config')

const signJWT = id =>
  sign({ id }, JWT_SECRET, {
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
    throw new AppError('please provide your email and password', 400)
  const user = await User.findOne({ email }).select('+password')
  if (!user || !(await user.verifyPassword(password)))
    throw new AppError('invalid email or password', 401)
  const token = signJWT(user._id)
  res.status(200).json({
    status: 'success',
    token,
  })
})

exports.protect = catchAsync(async (req, res, next) => {
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }
  if (!token) throw new AppError('please log in to get access', 401)
  const decoded = await promisify(verify)(token, JWT_SECRET)
  const user = await User.findById(decoded.id)
  if (!user) throw new AppError('user no longer exists', 401)
  if (user.passwordChangedAfter(decoded.iat))
    throw new AppError(
      'user recently changed their password, login with your new password',
      401
    )
  req.user = user
  next()
})
