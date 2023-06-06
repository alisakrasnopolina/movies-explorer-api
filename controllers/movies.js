const mongoose = require('mongoose');
const Movie = require('../models/movie');
const { STATUS_CREATED, MESSAGE_FORBIDDEN } = require('../utils/constants');

const { DocumentNotFoundError } = mongoose.Error;
const ForbiddenError = require('../errors/forbidden_error');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movie) => res.send(movie))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const ownerId = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    owner: ownerId,
    thumbnail,
    movieId,
  })
    .then((movie) => res.status(STATUS_CREATED).send(movie))
    .catch(next);
};

module.exports.deleteMovieById = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail()
    .populate(['owner'])
    .then((movie) => {
      if (!movie) {
        throw new DocumentNotFoundError();
      }
      if (req.user._id === movie.owner._id.toString()) {
        movie.deleteOne()
          .then(res.send(movie))
          .catch(next);
      } else {
        next(new ForbiddenError(MESSAGE_FORBIDDEN));
      }
    })
    .catch(next);
};
