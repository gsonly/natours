const { IN_PROD } = require('../config')
const { AppError } = require('../utils')

const handleCastError = err => {
  const message = `Invalid ${err.path}: ${err.value}`
  return new AppError(message, 400)
}

const handleDuplicateError = err => {
  const message = `duplicate field found: ${JSON.stringify(err.keyValue)}`
  return new AppError(message, 400)
}

const handleValidationError = err => {
  const message = Object.values(err.errors)
    .map(v => v.message)
    .join(', ')
  return new AppError(message, 400)
}

const handleJWTTokenError = err =>
  new AppError(`${err.message}, login again`, 401)

const handleJWTExpiredError = err =>
  new AppError(`${err.message}, login again`, 401)

const devError = (err, res, req) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    })
  }
  res.status(err.statusCode).render('error', {
    title: 'something went wrong',
    msg: err.message,
  })
}

const prodError = (err, res, req) => {
  if (req.originalUrl.startsWith('/api'))
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      })
    } else {
      console.log(err)
      return res.status(err.statusCode).json({
        status: err.status,
        message: 'something went wrong',
      })
    }
  if (err.isOperational) {
    res.status(err.statusCode).render('error', {
      title: 'something went wrong',
      msg: err.message,
    })
  } else {
    console.log(err)
    res.status(err.statusCode).render('error', {
      title: 'something went wrong',
      msg: 'please try again later!',
    })
  }
}

exports.globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'
  if (!IN_PROD) {
    devError(err, res, req)
  } else {
    let error = { ...err }
    error.message = err.message
    if (error.kind === 'ObjectId') error = handleCastError(error)
    if (error.code === 11000) error = handleDuplicateError(error)
    if (error._message && !!err._message.indexOf('validation'))
      error = handleValidationError(error)
    if (error.name === 'JsonWebTokenError') error = handleJWTTokenError(error)
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError(error)
    prodError(error, res, req)
  }
}
