const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { STATUS_CREATED, STATUS_OK, MESSAGE_SUCCESSFUL_LOGOUT } = require('../utils/constants');

const ConflictError = require('../errors/conflict_error');

const { NODE_ENV, JWT_SECRET } = require('../utils/config');

function getUserById(req, res, next, id) {
  User.findById(id)
    .orFail()
    .then((user) => res.send(user))
    .catch(next);
}

module.exports.getUser = (req, res, next) => {
  getUserById(req, res, next, req.user._id);
};

function update(req, res, next, { name, email }) {
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch(next);
}

module.exports.updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user || user._id.toString() === req.user._id) {
        update(req, res, next, { name, email });
      } else {
        next(new ConflictError());
      }
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { name } = req.body;
  bcrypt.hash(req.body.password, 10)

    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name,
    }))
    .then((user) => res.status(STATUS_CREATED).send(user))
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );

      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: none,
          secure: true,
        })
        .send({ email });
    })
    .catch(next);
};

module.exports.logout = async (req, res, next) => {
  try {
    res
      .clearCookie('jwt', {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      })
      .status(STATUS_OK)
      .send({ message: MESSAGE_SUCCESSFUL_LOGOUT });
  } catch (err) {
    next();
  }
};
