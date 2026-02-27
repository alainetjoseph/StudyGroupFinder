
const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({

  groupName: {
    type: String,
    required: true,
    trim: true
  },

  subject: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    required: true,
    trim: true
  },

  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  }],

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },

  status: {
    type: String,
    enum: ["approved", "pending", "rejected"],
    default: "pending"
  }

}, { timestamps: true });

module.exports = mongoose.model("Group", groupSchema);
