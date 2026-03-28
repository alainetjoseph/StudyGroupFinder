const mongoose = require("mongoose");

const ActivityLogSchema = new mongoose.Schema({
  actionType: { 
    type: String, 
    required: true,
    index: true 
  }, // e.g., "USER_BANNED", "GROUP_LOCKED", "EMAIL_SENT", "USER_JOINED_GROUP"
  
  actor: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    name: { type: String },
    type: { type: String, enum: ["admin", "user", "system"], default: "user" }
  },
  
  target: {
    id: { type: mongoose.Schema.Types.ObjectId, index: true },
    name: { type: String },
    type: { type: String, enum: ["user", "group", "report", "email", "message"], index: true }
  },
  
  status: { 
    type: String, 
    enum: ["success", "failed"], 
    default: "success",
    index: true 
  },
  
  metadata: { 
    type: mongoose.Schema.Types.Mixed 
  }, // reason, subject, error message, etc.
  
  ipAddress: { type: String },
  userAgent: { type: String }
}, { timestamps: true });

// Compound indexes for common filtering patterns
ActivityLogSchema.index({ createdAt: -1 });
ActivityLogSchema.index({ actionType: 1, createdAt: -1 });
ActivityLogSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model("ActivityLog", ActivityLogSchema);
