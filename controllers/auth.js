const crypto = require('crypto')
const { sign, verify } = require('jsonwebtoken')
const { promisify } = require('util')
const { User } = require('../models')
const { catchAsync, AppError, Email } = require('../utils')
const { JWT_SECRET, JWT_TTL, IN_PROD, COOKIE_TTL } = require('../config')

const signJWT = id =>
  sign({ id }, JWT_SECRET, {
    expiresIn: JWT_TTL,
  })

const sendToken = (code, user, res) => {
  const token = signJWT(user._id)
  const cookieTTL = COOKIE_TTL * 24 * 60 * 60 * 1000
  const cookieOpts = {
    expires: new Date(Date.now() + cookieTTL),
    httpOnly: true,
  }
  if (IN_PROD) cookieOpts.secure = true
  res.cookie('jwt', token, cookieOpts)
  user.password = undefined
  res.status(code).json({
    status: 'success',
    token,
    data: {
      user,
    },
  })
}

exports.signup = catchAsync(async (req, res) => {
  const user = await User.create(req.body)
  const url = `${req.protocol}://${req.get('host')}/me`
  await new Email(user, url).sendWelcome()
  sendToken(201, user, res)
})

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password)
    throw new AppError('please provide your email and password', 400)
  const user = await User.findOne({ email }).select('+password')
  if (!user || !(await user.verifyPassword(password)))
    throw new AppError('invalid email or password', 401)
  sendToken(200, user, res)
})

exports.logout = (req, res, next) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  })
  res.status(200).json({
    status: 'success',
  })
}

// api
exports.protect = catchAsync(async (req, res, next) => {
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt
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
  res.locals.user = user
  next()
})

// web
exports.isLoggedIn = catchAsync(async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      const decoded = await promisify(verify)(req.cookies.jwt, JWT_SECRET)
      const user = await User.findById(decoded.id)
      if (!user) return next()
      if (user.passwordChangedAfter(decoded.iat)) return next()
      res.locals.user = user
      return next()
    }
  } catch (err) {
    return next()
  }
  next()
})

exports.restrict = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    throw new AppError('you are not authorized to perfom this action', 403)
  next()
}

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body
  const user = await User.findOne({ email })
  if (!user) throw new AppError('user does not exists', 404)
  const resetToken = user.createResetToken()
  await user.save({ validateBeforeSave: false })
  try {
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`
    await new Email(user, resetURL).sendPasswordReset()
    res.status(200).json({
      status: 'success',
      message: 'Email sent!',
    })
  } catch (err) {
    user.resetToken = undefined
    user.resetTokenExp = undefined
    await user.save({ validateBeforeSave: false })
    throw new AppError(
      'there was issues resetting your password, try again later',
      500
    )
  }
})

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { password, passwordConfirm } = req.body
  const resetToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex')
  const user = await User.findOne({
    resetToken,
    resetTokenExp: { $gt: Date.now() },
  })
  if (!user) throw new AppError('token is invalid or has expired', 400)
  user.password = password
  user.passwordConfirm = passwordConfirm
  user.passwordChangedAt = Date.now()
  user.resetToken = undefined
  user.resetTokenExp = undefined
  await user.save()
  sendToken(200, user, res)
})

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { oldPassword, newPassword, newPasswordConfirm } = req.body
  const user = await User.findById(req.user._id).select('+password')
  if (!user.verifyPassword(oldPassword))
    throw new AppError('password is not correct', 401)
  user.password = newPassword
  user.passwordConfirm = newPasswordConfirm
  user.passwordChangedAt = Date.now()
  await user.save()
  sendToken(200, user, res)
})
