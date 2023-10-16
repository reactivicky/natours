const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const saltRounds = 12;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid Email'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: 'Passwords are not same',
    },
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, saltRounds);
  this.passwordConfirm = undefined;

  next();
});

userSchema.methods.correctPassword = async function (cp, up) {
  return await bcrypt.compare(cp, up);
};

module.exports = mongoose.model('User', userSchema);
