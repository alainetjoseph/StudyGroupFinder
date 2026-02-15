const mongoose = require('mongoose')

let userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    pass: String,
    terms: Boolean,
    groupsJoined: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "groups"
    }],
    groupsCreated: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "groups"
    }
    ],
    isAdmin: {
      type: Boolean,
      default: false
    }
  }
)

const Users = mongoose.model('users', userSchema);

module.exports = Users;
