const router = require('express').Router();
const mongoose = require('mongoose');
const routerUsers = require('./users');
const routerMovies = require('./movies');
const { login, createUser, logout } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { validationCreateUser, validationLogin } = require('../utils/validation');

const { DocumentNotFoundError } = mongoose.Error;

router.post('/signup', validationCreateUser, createUser);
router.post('/signin', validationLogin, login);

router.use('/users', auth, routerUsers);

router.use('/movies', auth, routerMovies);

router.post('/signout', auth, logout);

router.use('*', (req, res, next) => {
  next(new DocumentNotFoundError());
});

module.exports = router;
