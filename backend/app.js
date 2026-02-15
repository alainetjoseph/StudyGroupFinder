var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dbConnection = require('./config/connection')
var cors = require('cors')
require("dotenv").config()

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var groupRouter = require('./routes/groups');

const session = require('express-session');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))
app.use(session({
  secret: process.env.TOKEN_SECRET,
  cookie: { maxAge: 1000 * 60 * 10 },
  resave: false,
  saveUninitialized: false
}))

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/groups', groupRouter);

module.exports = app;
