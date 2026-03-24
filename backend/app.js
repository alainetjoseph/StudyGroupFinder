require("dotenv").config()
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dbConnection = require('./config/connection')
var cors = require('cors')

var indexRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var groupRouter = require('./routes/groups');

const session = require('express-session');
const { default: MongoStore } = require("connect-mongo");

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);
// app.use(cors({
//   origin: ["http://localhost:5173", "https://study-group-finder-eta.vercel.app"],
//   credentials: true
// }))

const allowedOrigins = [
  "http://localhost:5173",
  "https://study-group-finder-eta.vercel.app"
];

app.use(cors({
  origin: (origin, callback) => {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      origin.startsWith("http://192.168.")
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.set("trust proxy", 1)
const sessionMiddleware = session({
  secret: process.env.TOKEN_SECRET,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URL,
    collectionName: "sessions",
  }),
  cookie: {
    maxAge: 1000 * 60 * 10,
    secure: process.env.mode === "production",
    httpOnly: true,
    sameSite: "lax"
  },
  resave: false,
  saveUninitialized: false
});

app.use(sessionMiddleware);
app.sessionMiddleware = sessionMiddleware;


app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/groups', groupRouter);

module.exports = app;
