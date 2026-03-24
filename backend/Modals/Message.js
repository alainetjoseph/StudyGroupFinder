const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "groups",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    isQuestion: {
      type: Boolean,
      default: false
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Messages", messageSchema);
