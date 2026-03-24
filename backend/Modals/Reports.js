var mongoose = require("mongoose")



const reportSchema = new mongoose.Schema({
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },

  targetType: {
    type: String,
    enum: ["user", "group", "message"],
    required: true
  },

  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },

  reason: {
    type: String,
    enum: ["spam", "harassment", "inappropriate", "fake", "other"],
    required: true
  },

  description: {
    type: String,
    maxlength: 500
  },

  snapshot: {
    title: String,
    text: String,

    owner: String,
    ownerId: mongoose.Schema.Types.ObjectId,

    messageId: mongoose.Schema.Types.ObjectId,
    messageText: String,

    images: [String]
  },

  evidenceImages: {
    type: [String],
    default: []
  },

  status: {
    type: String,
    enum: ["pending", "reviewing", "resolved", "dismissed"],
    default: "pending"
  },

  actionTaken: {
    type: String,
    enum: ["none", "warning", "content_removed", "user_banned"],
    default: "none"
  },

  moderatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  }

}, { timestamps: true });

module.exports = mongoose.model("reports", reportSchema);
