const multer = require('multer')
const { User } = require('../models')
const { catchAsync } = require('../utils')
const { AppError } = require('../utils')
const { deleteOne, updateOne, getOne, getAll } = require('./factory')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/users')
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1]
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`)
  },
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true)
  } else {
    cb(new AppError('Not an image! please upload images only', 400), false)
  }
}

const upload = multer({ storage, fileFilter })

exports.fileUpload = upload.single('avatar')

const filteredBody = (obj, ...fields) => {
  const filteredObj = {}
  Object.keys(obj).forEach(k => {
    if (fields.includes(k)) filteredObj[k] = obj[k]
  })
  return filteredObj
}

exports.getMe = (req, res, next) => {
  req.params.id = req.user._id
  next()
}

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm)
    throw new AppError('use /updatePassword for passwords', 400)
  const body = filteredBody(req.body, 'name', 'email')
  if (req.file) body.photo = req.file.filename
  const user = await User.findByIdAndUpdate(req.user._id, body, {
    new: true,
    runValidators: true,
  })
  res.status(200).json({
    status: 'success',
    data: { user },
  })
})

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false })
  res.status(204).json({
    status: 'success',
    data: null,
  })
})

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'use /signup to create an account',
  })
}

exports.getUsers = getAll(User)
exports.getUser = getOne(User)
exports.updateUser = updateOne(User)
exports.deleteUser = deleteOne(User)
