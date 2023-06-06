const mongoose = require('mongoose');

const {
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
  STATUS_CONFLICT,
  STATUS_INTERNAL_SERVER_ERROR,
  MESSAGE_NO_DATA,
  MESSAGE_WRONG_DATA,
  MESSAGE_ALREADY_EXISTS,
  MESSAGE_INTERNAL_SERVER_ERROR,
} = require('../utils/constants');

const { CastError, ValidationError, DocumentNotFoundError } = mongoose.Error;
const ForbiddenError = require('./forbidden_error');
const UnauthorizedError = require('./unauthorized_error');
const ConflictError = require('./conflict_error');

const handleErrors = (err, res) => {
  if (err instanceof DocumentNotFoundError) {
    return res.status(STATUS_NOT_FOUND).send({ message: MESSAGE_NO_DATA });
  }
  if (err instanceof CastError || err instanceof ValidationError) {
    return res.status(STATUS_BAD_REQUEST).send({ message: MESSAGE_WRONG_DATA });
  }
  if (err.code === 11000 || err instanceof ConflictError) {
    return res.status(STATUS_CONFLICT).send({ message: MESSAGE_ALREADY_EXISTS });
  }
  if (err instanceof UnauthorizedError || err instanceof ForbiddenError) {
    return res.status(err.statusCode).send({ message: err.message });
  }
  return res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: MESSAGE_INTERNAL_SERVER_ERROR });
};

module.exports = { handleErrors };
