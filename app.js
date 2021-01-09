const express = require('express')
const morgan = require('morgan')
const path = require('path')
const { tourRoutes, userRoutes } = require('./routes')
const { IN_PROD } = require('./config')

const assetspath = path.join(__dirname, '/public')

const app = express()

if (!IN_PROD) app.use(morgan('dev'))

app.use(express.json())

app.use(express.static(assetspath))

app.use('/api/v1/tours', tourRoutes)

app.use('/api/v1/users', userRoutes)

module.exports = app
