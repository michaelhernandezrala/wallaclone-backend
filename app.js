'use strict';

const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const jwtAuth = require('./lib/jwtAuth');

const cors = require('cors');
const app = express();
require("dotenv").config(); 

const corsOptions = {
  origin: '*',
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
require("./models");

require('dotenv').config(); // inicializamos variables de entrono desde el fichero .env

const i18n = require('./lib/i18nSetup');

// Connect DB & register models
require('./models');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

if (process.env.LOG_FORMAT !== 'nolog') {
  app.use(logger(process.env.LOG_FORMAT || 'dev'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(i18n.init);

// Global Template variables
app.locals.title = 'Wallaclone';

// API v1
app.use('/api/register', require('./routes/api/register'));
app.use('/api/login', require('./routes/api/login'));
app.use('/api/adverts', require('./routes/api/adverts'));
app.use("/api/new-advert", require("./routes/api/new-advert"))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error(__('not_found'));
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  if (err.array) {
    // validation error
    err.status = 422;
    const errInfo = err.array({ onlyFirstError: true })[0];
    err.message = isAPI(req)
      ? { message: __('not_valid'), errors: err.mapped() }
      : `${__('not_valid')} - ${errInfo.param} ${errInfo.msg}`;
  }

  // Request status
  err.status = err.status || 500;
  res.status(err.status);

  // if status is 500 write the erroe in the log
  if (err.status && err.status >= 500) console.error(err);

  // si es una petición al API respondo JSON...
  if (isAPI(req)) {
    res.json({ success: false, error: err.message });
    return;
  }

  // ...y si no respondo con HTML...

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.render('error');
});

function isAPI(req) {
  return req.originalUrl.indexOf('/api') === 0;
}

module.exports = app;
