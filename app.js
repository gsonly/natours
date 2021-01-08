const express = require('express')
const fs = require('fs')
const path = require('path')
const morgan = require('morgan')

const app = express()

app.use(morgan('dev'))

app.use(express.json())

const filepath = path.join(__dirname, '/dev-data/data/tours-simple.json')

const tours = JSON.parse(fs.readFileSync(filepath, 'utf-8'))

const getTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  })
}

const getTour = (req, res) => {
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

const updateTour = (req, res) => {
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

const deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null
  })
}

const createTour = (req, res) => {
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

const getUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'not implemented'
  })
}
const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'not implemented'
  })
}
const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'not implemented'
  })
}
const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'not implemented'
  })
}
const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'not implemented'
  })
}

app.route('/api/v1/tours').get(getTours).post(createTour)

app.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour)

app.route('/api/v1/users').get(getUsers).post(createUser)

app.route('/api/v1/users/:id').get(getUser).patch(updateUser).delete(deleteUser)

app.listen(3000, console.log(`http://localhost:${3000}`))
