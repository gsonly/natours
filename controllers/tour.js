const fs = require('fs')
const path = require('path')

const filepath = path.join(__dirname, '../dev-data/data/tours-simple.json')

const tours = JSON.parse(fs.readFileSync(filepath, 'utf-8'))

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Bad request: missing name or price'
    })
  }
  next()
}

exports.checkID = (req, res, next, val) => {
  console.log(val)
  if (val >= tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    })
  }
  next()
}

exports.getTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  })
}

exports.getTour = (req, res) => {
  const tour = tours.find(tour => tour.id === +req.params.id)

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  })
}

exports.updateTour = (req, res) => {
  const tour = tours.find(tour => tour.id === +req.params.id)

  const newTour = Object.assign(tour, req.body)
  console.log(newTour)
  res.status(200).json({
    status: 'success',
    data: {
      tour: newTour
    }
  })
}

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null
  })
}

exports.createTour = (req, res) => {
  const id = tours[tours.length - 1].id + 1
  const tour = Object.assign({ id }, req.body)
  tours.push(tour)
  fs.writeFile(filepath, JSON.stringify(tours), e => {
    if (e) throw new Error(e)
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    })
  })
}
