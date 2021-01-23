const mongoose = require('mongoose')
const isEmail = require('validator/lib/isEmail')
const { hash, compare } = require('bcryptjs')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'please tell us your name'],
    },
    email: {
      type: String,
      validate: [isEmail, 'please provide a valid email'],
      required: [true, 'please provide your email'],
      unique: true,
      lowercase: true,
    },
    photo: String,
    password: {
      type: String,
      required: [true, 'a user must have a password'],
      minlength: 8,
      maxlength: 254,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'please confirm your password'],
      validate: {
        validator: function (val) {
          return this.password === val
        },
        message: 'passwords do not match',
      },
    },
    passwordChangedAt: Date,
  },
  {
    timestamps: true,
  }
)

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await hash(this.password, 12)
  this.passwordConfirm = undefined

  next()
})

userSchema.methods.verifyPassword = async function (password) {
  return await compare(password, this.password)
}

userSchema.methods.passwordChangedAfter = function (jwtTimestamp) {
  if (this.passwordChangedAt) {
    const timestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)
    return timestamp > jwtTimestamp
  }
  return false
}

module.exports = mongoose.model('User', userSchema)
