const nodemailer = require("nodemailer");
const EmailLog = require("../models/EmailLog");
const { generateEmailHTML } = require("../templates/emailTemplate");
const { logActivity } = require("../utils/activityLogger.js");

// Initialize Nodemailer transporter
const dns = require("dns");

// 🔥 Force IPv4 globally (important for Render)
dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // optional (helps on some hosts)
  },
  lookup: (hostname, options, callback) => {
    require("dns").lookup(hostname, { family: 4 }, callback);
  },
});

/**
 * Sends an email synchronously (returns promise).
 * @param {Object} options
 * @returns {Promise}
 */
async function sendEmail({ to, subject, html }) {
  return transporter.sendMail({
    from: `"StudyGroupFinder" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}

/**
 * Sends an email asynchronously without blocking the main thread.
 * Logs the result to MongoDB.
 * 
 * @param {Object} payload
 * @param {string} payload.to - Recipient email
 * @param {string} payload.subject - Email subject
 * @param {string} payload.text - Email body content
 * @param {string} [payload.theme="dark"] - Email theme ("light" | "dark")
 * @param {Object} [payload.cta] - Call to action { text, link }
 * @param {Object} [payload.meta] - Additional metadata for logging
 */
function sendEmailAsync(payload) {
  // Use setImmediate to ensure this runs in the next check phase of the event loop
  setImmediate(async () => {
    try {
      const html = generateEmailHTML({
        title: payload.subject,
        text: payload.text,
        theme: payload.theme || "dark",
        cta: payload.cta,
      });

      await sendEmail({
        to: payload.to,
        subject: payload.subject,
        html,
      });

      // Log success
      await EmailLog.create({
        to: payload.to,
        subject: payload.subject,
        status: "success",
        meta: payload.meta,
      });

      // Log to ActivityLog for centralized view
      logActivity({
        actionType: "EMAIL_SENT",
        actor: { type: "system" },
        target: { name: payload.to, type: "email" },
        status: "success",
        metadata: { subject: payload.subject, ...payload.meta }
      });

    } catch (err) {
      console.error(`[EmailService] Failed to send email to ${payload.to}:`, err.message);

      // Log failure
      try {
        await EmailLog.create({
          to: payload.to,
          subject: payload.subject,
          status: "failed",
          error: err.message,
          meta: payload.meta,
        });

        // Log to ActivityLog for centralized view
        logActivity({
          actionType: "EMAIL_FAILED",
          actor: { type: "system" },
          target: { name: payload.to, type: "email" },
          status: "failed",
          metadata: { subject: payload.subject, error: err.message, ...payload.meta }
        });
      } catch (logErr) {
        console.error("[EmailService] Failed to log email error to MongoDB:", logErr.message);
      }
    }
  });
}

module.exports = {
  sendEmail,
  sendEmailAsync,
};
