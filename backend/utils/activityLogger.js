const ActivityLog = require("../models/ActivityLog");

/**
 * Log an activity to the database.
 * 
 * @param {Object} params
 * @param {string} params.actionType - Type of action (e.g., USER_BANNED)
 * @param {Object} params.actor - Who performed the action { id, name, type }
 * @param {Object} params.target - What was affected { id, name, type }
 * @param {string} [params.status="success"] - success or failed
 * @param {Object} [params.metadata] - Additional details
 * @param {Object} [params.req] - Express request object for IP and User-Agent
 */
const logActivity = async ({
  actionType,
  actor,
  target,
  status = "success",
  metadata = {},
  req = null
}) => {
  try {
    const logData = {
      actionType,
      actor,
      target,
      status,
      metadata,
    };

    if (req) {
      logData.ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      logData.userAgent = req.headers['user-agent'];
    }

    await ActivityLog.create(logData);
  } catch (err) {
    // We don't want to crash the request if logging fails, but we should know about it
    console.error(`[ActivityLogger] Failed to log activity ${actionType}:`, err.message);
  }
};

module.exports = { logActivity };
