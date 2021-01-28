const { catchAsync, AppError, Features } = require('../utils')

exports.getAll = model =>
  catchAsync(async (req, res, next) => {
    // nested review route
    const filter = {}
    if (req.params.id) filter.tour = req.params.id
    const features = new Features(model.find(filter), req.query)
      .filtering()
      .sorting()
      .fieldsLimiting()
      .pagination()
    const docs = await features.query
    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: {
        docs,
      },
    })
  })

exports.getOne = (model, opts) =>
  catchAsync(async (req, res, next) => {
    let query = model.findById(req.params.id)
    if (opts) query = query.populate(opts)
    const doc = await query
    if (!doc) throw new AppError('cannot find document with that ID', 404)
    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    })
  })

exports.createOne = model =>
  catchAsync(async (req, res, next) => {
    const doc = await model.create(req.body)
    res.status(201).json({
      status: 'success',
      data: {
        doc,
      },
    })
  })

exports.updateOne = model =>
  catchAsync(async (req, res, next) => {
    const doc = await model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!doc) throw new AppError('cannot find document with that ID', 404)
    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    })
  })

exports.deleteOne = model =>
  catchAsync(async (req, res, next) => {
    const doc = await model.findByIdAndDelete(req.params.id)
    if (!doc) throw new AppError('cannot find document with that ID', 404)
    res.status(204).json({
      status: 'success',
      data: null,
    })
  })
