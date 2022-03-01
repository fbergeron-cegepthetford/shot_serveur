const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const ValidationError = require('express-validation').ValidationError;
const bodyParser = require('body-parser');

const indexRouter = require('./routes/index');
const cdjRouter = require('./routes/routes_cdj');
const faitsRouter = require('./routes/routes_fait');

const app = express();

/*
https://www.youtube.com/watch?v=27FGDtO1wjM
 */

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/cdj', cdjRouter);
app.use('/fait', faitsRouter);

app.use(function(err, req, res, next) {
  if (err instanceof ValidationError) {
    const messages = [];
    for (const cle in err.details) {
      for (const index in err.details[cle]) {
        messages.push(`${cle} ${err.details[cle][index].message}`);
      }
    }
    console.log(messages);
    return res.status(err.statusCode).json(messages);
  }
  return res.status(500).json(err);
});

module.exports = app;
