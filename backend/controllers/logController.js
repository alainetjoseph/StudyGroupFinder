const ActivityLog = require("../models/ActivityLog");

/**
 * Get activity logs with filtering and pagination.
 */
exports.getLogs = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      actionType, 
      status, 
      search, 
      startDate, 
      endDate 
    } = req.query;

    const query = {};

    if (actionType) query.actionType = actionType;
    if (status) query.status = status;
    
    // Search by actor name or target name
    if (search) {
      query.$or = [
        { "actor.name": { $regex: search, $options: "i" } },
        { "target.name": { $regex: search, $options: "i" } },
        { "metadata.subject": { $regex: search, $options: "i" } }
      ];
    }

    // Date range filtering
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const logs = await ActivityLog.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    const total = await ActivityLog.countDocuments(query);

    res.json({
      success: true,
      logs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });

  } catch (err) {
    console.error("Fetch Logs Error:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error while fetching logs",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

/**
 * Get distinct action types for filtering.
 */
exports.getActionTypes = async (req, res) => {
  try {
    const types = await ActivityLog.distinct("actionType");
    res.json({ success: true, types });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
