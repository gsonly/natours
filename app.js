const express = require('express')
const morgan = require('morgan')
const { tourRoutes, userRoutes } = require('./routes')

const app = express()

app.use(morgan('dev'))

app.use(express.json())

app.use('/api/v1/tours', tourRoutes)

app.use('/api/v1/users', userRoutes)

module.exports = app
