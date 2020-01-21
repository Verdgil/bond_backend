const express = require('express');
const path = require('path');
const logger = require('morgan');

const users_router = require('./routes/users');
const likes_router = require('./routes/likes');
const get_galery_router = require('./routes/get_galery');
const proxy_router = require('./routes/proxy');
const get_publication_router = require("./routes/get_publication");


let app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/users', users_router);
app.use('/likes', likes_router);
app.use('/get_galery', get_galery_router);
app.use('/send_rastr', proxy_router);
app.use('/get_publication', get_publication_router);

module.exports = app;
