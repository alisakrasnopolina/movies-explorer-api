const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const { errors } = require('celebrate');
const router = require('./routes/index');
const { handleErrors } = require('./errors/erorrs');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/rate_limiter');
require('dotenv').config();

const { PORT, BIT_FILM_DB, NODE_ENV } = require('./utils/config');

const { DocumentNotFoundError } = mongoose.Error;
const app = express();

const allowList = [
  'https://movies-explorer.alisa.nomoredomains.rocks',
  'http://movies-explorer.alisa.nomoredomains.rocks',
  'https://localhost:3000',
  'http://localhost:3000',
];

app.use(limiter);
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect((NODE_ENV === 'production' ? BIT_FILM_DB : 'mongodb://127.0.0.1:27017/bitfilmsdb'), {
  useNewUrlParser: true,
});

app.options(
  '*',
  cors({
    origin: allowList,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['Content-type', 'Authorization', 'Accept'],
    credentials: true,
    exposedHeaders: ['set-cookie'],
    optionsSuccessStatus: 204,
  }),
);

app.use(
  cors({
    origin: allowList,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['Content-type', 'Authorization', 'Accept'],
    credentials: true,
    exposedHeaders: ['set-cookie'],
    optionsSuccessStatus: 204,
  }),
);

app.use(requestLogger);

app.use(router);

app.use('*', (req, res, next) => {
  next(new DocumentNotFoundError());
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  handleErrors(err, res);
  next();
});

app.listen(PORT);
