const express = require('express')
const morgan = require('morgan')
const path = require('path')
const { tourRoutes, userRoutes } = require('./routes')

const assetspath = path.join(__dirname, '/public')

const app = express()

app.use(morgan('dev'))

app.use(express.json())

app.use(express.static(assetspath))

app.use('/api/v1/tours', tourRoutes)

app.use('/api/v1/users', userRoutes)

module.exports = app
