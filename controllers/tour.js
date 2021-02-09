const multer = require('multer')
const sharp = require('sharp')
const { Tour } = require('../models')
const { catchAsync, AppError } = require('../utils')
const { deleteOne, updateOne, createOne, getOne, getAll } = require('./factory')

const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true)
  } else {
    cb(new AppError('Not an image! please upload images only', 400), false)
  }
}

const upload = multer({ storage, fileFilter }).fields([
  { name: 'cover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
])

// TODO: return early
exports.filesUpload = (req, res, next) => {
  upload(req, res, err => {
    if (err instanceof multer.MulterError) {
      next(
        new AppError(
          'Multer experiencing error uploading your files, try again later!',
          500
        )
      )
    } else if (err) {
      next(
        new AppError(
          'Something went wrong while uploading the files, try again later!',
          500
        )
      )
    }
    next()
  })
}

exports.processFiles = catchAsync(async (req, res, next) => {
  if (!req.files.cover || !req.files.images) return next()
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`
  await sharp(req.files.cover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imageCover}`)

  req.body.images = []
  await Promise.all(
    req.files.images.map(async (b, i) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`
      req.body.images.push(filename)
      await sharp(b.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${filename}`)
    })
  )
  next()
})

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5'
  req.query.sort = '-ratingsAverage,price'
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
  next()
}

exports.getTours = getAll(Tour)
exports.getTour = getOne(Tour, { path: 'reviews' })
exports.createTour = createOne(Tour)
exports.updateTour = updateOne(Tour)
exports.deleteTour = deleteOne(Tour)

exports.getToursWithin = async (req, res, next) => {
  const { distance, latlng, unit } = req.params
  const coordinates = latlng
    .split(',')
    .map(c => parseFloat(c))
    .reverse()
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1
  if (!latlng)
    throw new AppError(
      'please provide latitude and longitude in a format lat,lng',
      400
    )
  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [coordinates, radius] } },
  })
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours },
  })
}

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params
  const coordinates = latlng
    .split(',')
    .map(c => parseFloat(c))
    .reverse()
  const distanceMultiplier = unit === 'mi' ? 0.000621371 : 0.001
  if (!latlng)
    throw new AppError(
      'please provide latitude and longitude in a format lat,lng',
      400
    )
  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: { type: 'Point', coordinates },
        distanceField: 'distance',
        distanceMultiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ])
  res.status(200).json({
    status: 'success',
    data: { distances },
  })
})

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: {
        avgPrice: 1,
      },
    },
    // {
    //   $match: { _id: { $ne: 'EASY' } },
    // },
  ])
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  })
})

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = +req.params.year
  const plans = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTours: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: { _id: 0 },
    },
    {
      $sort: { numTours: -1 },
    },
  ])
  res.status(200).json({
    status: 'success',
    data: {
      plans,
    },
  })
})
