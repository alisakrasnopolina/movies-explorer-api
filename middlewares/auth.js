const token = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized_error');
const { MESSAGE_AUTHORISATION_REQUIRED } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = require('../utils/config');

module.exports = (req, res, next) => {
  const { jwt } = req.cookies;

  if (!jwt) {
    return next(new UnauthorizedError(MESSAGE_AUTHORISATION_REQUIRED));
  }

  let payload;

  try {
    payload = token.verify(jwt, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return next(new UnauthorizedError(MESSAGE_AUTHORISATION_REQUIRED));
  }

  req.user = payload;

  return next();
};
