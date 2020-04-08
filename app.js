const express = require('express');
const path = require('path');
const logger = require('morgan');

const users_router = require('./routes/users');
const likes_router = require('./routes/likes');
const get_galery_router = require('./routes/get_galery');
const get_publication_router = require("./routes/get_publication");
const add_comment_router = require('./routes/add_comment');
const send_rastr_router = require('./routes/send_rastr');
const register_router = require('./routes/register');
const login_router = require('./routes/login');
const logout_router = require('./routes/logout');

let app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use('/static', express.static(__dirname + '/output'));
app.use('/users', users_router);
app.use('/likes', likes_router);
app.use('/get_galery', get_galery_router);
app.use('/get_publication', get_publication_router);
app.use('/add_comment', add_comment_router);
app.use('/send_rastr', send_rastr_router);
app.use('/register',register_router);
app.use('/login', login_router);
app.use('/logout', logout_router);

module.exports = app;
