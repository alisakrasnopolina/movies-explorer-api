const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const helmet = require('helmet');

const route = require('./routes/index');
const { handleErrors } = require('./errors/erorrs');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/rate_limiter');
const { PORT, BIT_FILM_DB, NODE_ENV } = require('./utils/config');

const allowList = [
  'https://movies-explorer.alisa.nomoredomains.rocks',
  'http://movies-explorer.alisa.nomoredomains.rocks',
  'https://localhost:3000',
  'http://localhost:3000',
];

require('dotenv').config();

const app = express();

mongoose.connect((NODE_ENV === 'production' ? BIT_FILM_DB : BIT_FILM_DB), {
  useNewUrlParser: true,
});

app.use(limiter);
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.use(route);

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  handleErrors(err, res);
  next();
});

app.listen(PORT);
