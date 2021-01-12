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

const devError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  })
}

const prodError = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    })
  } else {
    console.log(err)
    res.status(err.statusCode).json({
      status: err.status,
      message: 'something went wrong',
    })
  }
}

exports.globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500

  err.status = err.status || 'error'

  if (!IN_PROD) {
    devError(err, res)
  } else {
    let error = { ...err }

    if (err.kind === 'ObjectId') error = handleCastError(err)

    if (err.code === 11000) error = handleDuplicateError(err)

    if (!!err._message.indexOf('validation')) error = handleValidationError(err)

    prodError(error, res)
  }
}
