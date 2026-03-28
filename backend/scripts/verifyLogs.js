const mongoose = require("mongoose");
const { logActivity } = require("../utils/activityLogger");
const ActivityLog = require("../models/ActivityLog");
require("dotenv").config();

async function runTest() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected.");

    console.log("Triggering test logs...");

    await logActivity({
      actionType: "TEST_ACTION",
      actor: { name: "Test Runner", type: "system" },
      target: { name: "Test Target", type: "user" },
      status: "success",
      metadata: { note: "This is a verification test log" }
    });

    console.log("Log created successfully.");

    const latestLog = await ActivityLog.findOne({ actionType: "TEST_ACTION" }).sort({ createdAt: -1 });
    if (latestLog) {
      console.log("Verification PASSED: Found the test log in database.");
      console.log(JSON.stringify(latestLog, null, 2));
    } else {
      console.log("Verification FAILED: Could not find the test log.");
    }

    await mongoose.disconnect();
    console.log("Disconnected.");
    process.exit(0);
  } catch (err) {
    console.error("Test failed:", err);
    process.exit(1);
  }
}

runTest();
