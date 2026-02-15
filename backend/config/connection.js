const mongoose = require('mongoose')

mongoose.connect("mongodb://localhost:27017/sgf").then(() => {
  console.log("db connected");
})
