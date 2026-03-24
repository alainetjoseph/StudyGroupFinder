const mongoose = require("mongoose");

const MaterialSchema = new mongoose.Schema({

  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "groups",
    required: true
  },

  messageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "messages"
  },

  filename: String,
  originalName: String,
  path: String,

  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

MaterialSchema.index({ groupId: 1 });

module.exports = mongoose.model("materials", MaterialSchema);
