require("dotenv").config()
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dbConnection = require('./config/connection')
var cors = require('cors')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var groupRouter = require('./routes/groups');

const session = require('express-session');
const { default: MongoStore } = require("connect-mongo");

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
  origin: ["http://localhost:5173", "https://study-group-finder-eta.vercel.app"],
  credentials: true
}))
app.set("trust proxy", 1)
app.use(session({
  secret: process.env.TOKEN_SECRET,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URL,
    collectionName: "sessions",
  }),
  cookie: {
    maxAge: 1000 * 60 * 10,
    secure: process.env.mode === "production",
    httpOnly: true,
    sameSite: "none"
  },
  resave: false,
  saveUninitialized: false
}))


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/groups', groupRouter);

module.exports = app;
