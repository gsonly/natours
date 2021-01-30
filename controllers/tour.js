const { Tour } = require('../models')
const { catchAsync, AppError } = require('../utils')
const { deleteOne, updateOne, createOne, getOne, getAll } = require('./factory')

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
  const coordinates = latlng.split(',').reverse()
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
