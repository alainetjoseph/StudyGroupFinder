/**
 * Script to test the EmailService implementation.
 * Run this with: node backend/scripts/testEmail.js
 */
require("dotenv").config();
const mongoose = require("mongoose");
const { sendEmailAsync } = require("../services/emailService");
const EmailLog = require("../models/EmailLog");

async function runTest() {
  try {
    // 1. Connect to MongoDB
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected.");

    // 2. Trigger async email
    const testPayload = {
      to: process.env.EMAIL_USER, // Send to self for testing
      subject: "Test Email Service - Production Ready",
      text: "This is a test email sent using the new asynchronous EmailService with MongoDB logging.",
      theme: "dark",
      cta: {
        text: "View Dashboard",
        link: "http://localhost:5173",
      },
      meta: {
        type: "system_test",
        timestamp: new Date().toISOString(),
      },
    };

    console.log(`Triggering email to ${testPayload.to}...`);
    sendEmailAsync(testPayload);
    console.log("Email triggered (asynchronous). Waiting 5 seconds to check logs...");

    // 3. Wait for async operation and logging
    await new Promise(resolve => setTimeout(resolve, 5000));

    // 4. Verify log in DB
    const log = await EmailLog.findOne({ to: testPayload.to }).sort({ createdAt: -1 });

    if (log) {
      console.log("SUCCESS: EmailLog entry found!");
      console.log("Status:", log.status);
      if (log.status === "failed") {
        console.log("Error:", log.error);
      }
    } else {
      console.log("FAILURE: No EmailLog entry found.");
    }

  } catch (err) {
    console.error("Test failed:", err.message);
  } finally {
    await mongoose.connection.close();
    console.log("DB Connection closed.");
    process.exit(0);
  }
}

runTest();
