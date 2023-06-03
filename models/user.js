const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { MESSAGE_EMAIL_NOT_EXISTS, MESSAGE_WRONG_EMAIL_OR_PASSWORD } = require('../utils/constants');

const UnauthorizedError = require('../errors/unauthorized_error');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: MESSAGE_EMAIL_NOT_EXISTS,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
}, { toJSON: { useProjection: true }, toObject: { useProjection: true } });

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError(MESSAGE_WRONG_EMAIL_OR_PASSWORD));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError(MESSAGE_WRONG_EMAIL_OR_PASSWORD));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
