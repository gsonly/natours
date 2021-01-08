const fs = require('fs')
const path = require('path')

const filepath = path.join(__dirname, '../dev-data/data/tours-simple.json')

const tours = JSON.parse(fs.readFileSync(filepath, 'utf-8'))

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
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    })
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  })
}

exports.updateTour = (req, res) => {
  const tour = tours.find(tour => tour.id === +req.params.id)
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    })
  }
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
