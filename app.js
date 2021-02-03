const express = require('express')
const morgan = require('morgan')
const path = require('path')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
const cookieParser = require('cookie-parser')
const { tourRouter, userRouter, reviewRouter, viewRouter } = require('./routes')
const { IN_PROD } = require('./config')
const { AppError } = require('./utils')
const { globalErrorHandler } = require('./controllers')

const assetspath = path.join(__dirname, '/public')
const viewspath = path.join(__dirname, '/views')
const app = express()

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  message: 'too many requests from this IP, try again in an hour',
})

const hppOpts = hpp({
  whitelist: [
    'duration',
    'ratingsQuantity',
    'ratingsAverage',
    'maxGroupSize',
    'difficulty',
    'price',
  ],
})

if (!IN_PROD) app.use(morgan('dev'))

app.set('views', viewspath)
app.set('view engine', 'pug')
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
)
app.use('/api', limiter)
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))
app.use(mongoSanitize())
app.use(xss())
app.use(hppOpts)
app.use(cookieParser())
app.use(express.static(assetspath))
app.use('/', viewRouter)
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/reviews', reviewRouter)
app.all('*', (req, res, next) => {
  const err = new AppError(`cannot find ${req.originalUrl} on this server`, 404)
  next(err)
})
app.use(globalErrorHandler)

module.exports = app
