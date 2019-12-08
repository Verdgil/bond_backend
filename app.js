const express = require('express');
const path = require('path');
const logger = require('morgan');

const users_router = require('./routes/users');

let app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


// app.use('/users', users_router);

module.exports = app;
