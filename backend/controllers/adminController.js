const User = require("../Modals/Users");
const Group = require("../Modals/Groups");
const Report = require("../Modals/Reports");
const Message = require("../Modals/Message");

// Simple in-memory cache
let statsCache = {
  data: null,
  timestamp: 0
};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Get platform-wide statistics for the admin dashboard.
 * Includes totals, growth data, and engagement metrics.
 */
exports.getStats = async (req, res) => {
  try {
    const now = Date.now();

    // Check cache
    if (statsCache.data && (now - statsCache.timestamp < CACHE_TTL)) {
      return res.json({ success: true, ...statsCache.data, cached: true });
    }

    // 1. Fetch Totals
    const [
      totalUsers,
      activeUsers, // Users who have joined or created groups (simplistic "active" metric)
      totalGroups,
      pendingReports,
      totalMessages
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({
        $or: [
          { groupsJoined: { $not: { $size: 0 } } },
          { groupsCreated: { $not: { $size: 0 } } }
        ]
      }),
      Group.countDocuments(),
      Report.countDocuments({ status: "pending" }),
      Message.countDocuments()
    ]);

    // 2. Growth Data (Last 6 Months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const growthAggregation = async (Model) => {
      return await Model.aggregate([
        {
          $match: {
            createdAt: { $gte: sixMonthsAgo }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" }
            },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1 }
        },
        {
          $project: {
            _id: 0,
            date: {
              $concat: [
                { $toString: "$_id.year" },
                "-",
                {
                  $cond: {
                    if: { $lt: ["$_id.month", 10] },
                    then: { $concat: ["0", { $toString: "$_id.month" }] },
                    else: { $toString: "$_id.month" }
                  }
                }
              ]
            },
            count: 1
          }
        }
      ]);
    };

    const [userGrowth, groupGrowth] = await Promise.all([
      growthAggregation(User),
      growthAggregation(Group)
    ]);

    // 3. Engagement Metrics (Placeholder/Calculated)
    // For now, return a mock/placeholder for avgTime as per requirements
    const engagement = {
      avgTime: 5.6 // Minutes
    };

    const responseData = {
      totals: {
        users: totalUsers,
        activeUsers,
        groups: totalGroups,
        reports: pendingReports,
        messages: totalMessages
      },
      growth: {
        users: userGrowth,
        groups: groupGrowth
      },
      engagement
    };

    // Update cache
    statsCache = {
      data: responseData,
      timestamp: now
    };

    res.json({ success: true, ...responseData });

  } catch (err) {
    console.error("Stats API Error:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error while fetching statistics",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};
