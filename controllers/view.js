const { Tour } = require('../models')
const { catchAsync } = require('../utils')

exports.getOverview = catchAsync(async (req, res) => {
  const tours = await Tour.find({})
  res.status(200).render('overview', {
    title: 'Exciting tours for adventurous people',
    tours,
  })
})

exports.getTour = catchAsync(async (req, res) => {
  const { slug } = req.params
  const tour = await Tour.findOne({ slug }).populate({
    path: 'reviews',
    select: 'review rating user',
  })
  res.status(200).render('tour', { title: tour.name, tour })
})
