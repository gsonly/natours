exports.getOverview = (req, res, next) =>
  res
    .status(200)
    .render('overview', { title: 'Exciting tours for adventurous people' })

exports.getTour = (req, res, next) =>
  res.status(200).render('tour', { title: 'the forest hiker' })
