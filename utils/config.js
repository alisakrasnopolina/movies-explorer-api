require('dotenv').config();

const {
  PORT,
  BIT_FILM_DB,
  JWT_SECRET,
  NODE_ENV,
} = process.env;

module.exports = {
  PORT,
  BIT_FILM_DB,
  JWT_SECRET,
  NODE_ENV,
};
