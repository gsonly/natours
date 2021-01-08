const express = require('express')
const fs = require('fs')
const path = require('path')

const app = express()

app.use(express.json())

const filepath = path.join(__dirname, '/dev-data/data/tours-simple.json')

const tours = JSON.parse(fs.readFileSync(filepath, 'utf-8'))

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  })
})

app.get('/api/v1/tours/:id', (req, res) => {
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
})

app.patch('/api/v1/tours/:id', (req, res) => {
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
})

app.delete('/api/v1/tours/:id', (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null
  })
})

app.post('/api/v1/tours', (req, res) => {
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
})

app.listen(3000, console.log(`http://localhost:${3000}`))
