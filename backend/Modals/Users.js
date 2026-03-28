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
    },
    isBanned: {
      type: Boolean,
      default: false
    },
    // banReason: {
    //   type: String,
    //   default: ""
    // },
    subjects: {
      type: [String],
      default: []
    },
    bio: {
      type: String,
      default: ""
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
)

const Users = mongoose.model('users', userSchema);

module.exports = Users;
