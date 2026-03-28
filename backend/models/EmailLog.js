const mongoose = require("mongoose");

const EmailLogSchema = new mongoose.Schema({
  to: { type: String, required: true },
  subject: { type: String, required: true },
  status: { type: String, enum: ["success", "failed"], required: true },
  error: { type: String },
  meta: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

module.exports = mongoose.model("EmailLog", EmailLogSchema);
