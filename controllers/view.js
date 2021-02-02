const { Tour } = require('../models')
const { catchAsync, AppError } = require('../utils')

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
  if (!tour) throw new AppError('There is no tour with that name', 404)
  res.status(200).render('tour', { title: tour.name, tour })
})

exports.getLogin = (req, res) => {
  res.status(200).render('login', { title: 'Log into your account' })
}
