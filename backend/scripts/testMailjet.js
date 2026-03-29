const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const emailService = require('../services/emailService');
const EmailLog = require('../models/EmailLog');

async function testEmailService() {
  try {
    // Connect to MongoDB (needed for logging and idempotency check)
    await mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/sgf');
    console.log("✅ Connected to MongoDB");

    const testPayload = {
      to: process.env.EMAIL_USER,
      subject: "Idempotency Test",
      text: "This should only be logged once.",
      meta: { requestId: "static-test-id-123" }
    };

    console.log("🚀 Triggering sendEmailAsync...");
    emailService.sendEmailAsync(testPayload);

    console.log("⏳ Waiting for processing (async)...");
    await new Promise(resolve => setTimeout(resolve, 5000));

    const log = await EmailLog.findOne({ subject: "Mailjet Integration Test" }).sort({ createdAt: -1 });
    if (log) {
      console.log("📊 Log found:", JSON.stringify(log, null, 2));
    } else {
      console.error("❌ No log found in MongoDB!");
    }

  } catch (err) {
    console.error("💥 Test failed:", err);
  } finally {
    await mongoose.disconnect();
  }
}

testEmailService();
