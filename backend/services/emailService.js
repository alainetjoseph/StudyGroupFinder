const { v4: uuidv4 } = require('uuid');
const { BrevoClient } = require("@getbrevo/brevo");
const EmailLog = require("../models/EmailLog");
const { generateEmailHTML } = require("../templates/emailTemplate");
const { logActivity } = require("../utils/activityLogger.js");

// Environment Validation
if (!process.env.BREVO_API_KEY || !process.env.EMAIL_USER) {
  console.error("[EmailService] CRITICAL: BREVO_API_KEY or EMAIL_USER missing in environment.");
  // We don't throw here to avoid crashing the whole app, but all email calls will fail
}

// Initialize Brevo client using the new BrevoClient SDK
const client = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

/**
 * Extracts a meaningful error message from Brevo SDK response.
 */
function getBrevoError(err) {
  return (
    err?.response?.data?.message ||
    err?.response?.body?.message ||
    err?.message ||
    "Unknown Brevo error"
  );
}

/**
 * Checks if an error is transient and should be retried.
 * Retries only on network issues or 5xx server errors.
 */
function isTransientError(err) {
  // Network issues
  const networkErrors = ["ECONNRESET", "ETIMEDOUT", "ECONNREFUSED", "EAI_AGAIN"];
  if (networkErrors.includes(err.code)) return true;

  // Brevo server-side errors (5xx)
  const statusCode = err.response?.status || err.response?.statusCode || err.status || err.statusCode;
  if (statusCode >= 500) return true;

  return false;
}

/**
 * Sends an email synchronously using Brevo Transactional Emails SMTP API.
 * 
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @returns {Promise}
 */
async function sendEmail({ to, subject, html }) {
  if (!process.env.BREVO_API_KEY) {
    throw new Error("BREVO_API_KEY is not configured");
  }

  return client.transactionalEmails.sendTransacEmail({
    subject: subject,
    htmlContent: html,
    sender: { 
      email: process.env.EMAIL_USER, 
      name: "StudyGroupFinder" 
    },
    to: [{ email: to }],
  });
}

/**
 * Sends an email asynchronously without blocking the main thread.
 * Includes idempotency check, exponential backoff, and detailed logging.
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
  // Use unique requestId for idempotency
  const requestId = payload.meta?.requestId || uuidv4();
  const maxAttempts = 3;

  console.log(`[EmailService] Queued email to ${payload.to} (ID: ${requestId})`);

  // Use setImmediate to ensure this runs in the next check phase of the event loop
  setImmediate(async () => {
    console.log(`[EmailService] Processing async email (ID: ${requestId})...`);
    let attempt = 0;
    let success = false;
    let lastError = null;

    while (attempt < maxAttempts && !success) {
      try {
        console.log(`[EmailService] Attempt ${attempt + 1}...`);
        // IDEMPOTENCY: Check if this request was already processed successfully
        const existingLog = await EmailLog.findOne({ 
          "meta.requestId": requestId, 
          status: "success" 
        });
        
        if (existingLog) {
          console.log(`[EmailService] Request ${requestId} already processed. Skipping.`);
          return;
        }

        const html = generateEmailHTML({
          title: payload.subject,
          text: payload.text,
          theme: payload.theme || "dark",
          cta: payload.cta,
        });

        const response = await sendEmail({
          to: payload.to,
          subject: payload.subject,
          html,
        });

        // Brevo returns an object with a messageId field
        const messageId = response.messageId;
        success = true;

        // Log success to MongoDB
        await EmailLog.create({
          to: payload.to,
          subject: payload.subject,
          status: "success",
          meta: { 
            ...payload.meta, 
            requestId, 
            messageId, 
            provider: "brevo",
            brevoResponse: response 
          },
        });

        // Log to ActivityLog for centralized view
        logActivity({
          actionType: "EMAIL_SENT",
          actor: { type: "system" },
          target: { name: payload.to, type: "email" },
          status: "success",
          metadata: { 
            subject: payload.subject, 
            requestId, 
            messageId,
            provider: "brevo",
            ...payload.meta 
          }
        });

      } catch (err) {
        lastError = err;
        attempt++;
        const errorMessage = getBrevoError(err);
        
        console.error(`[EmailService] Attempt ${attempt} failed for ${payload.to}:`, errorMessage);

        // Determine if we should retry
        if (attempt < maxAttempts && isTransientError(err)) {
          const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
          console.log(`[EmailService] Transient error. Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          // Non-transient error or max attempts reached
          break;
        }
      }
    }

    if (!success) {
      const finalErrorMessage = getBrevoError(lastError);
      
      try {
        // Log failure to MongoDB
        await EmailLog.create({
          to: payload.to,
          subject: payload.subject,
          status: "failed",
          error: finalErrorMessage,
          meta: { 
            ...payload.meta, 
            requestId,
            provider: "brevo",
            brevoError: lastError?.response?.data || lastError?.message 
          },
        });

        // Log to ActivityLog
        logActivity({
          actionType: "EMAIL_FAILED",
          actor: { type: "system" },
          target: { name: payload.to, type: "email" },
          status: "failed",
          metadata: { 
            subject: payload.subject, 
            error: finalErrorMessage, 
            requestId,
            provider: "brevo",
            ...payload.meta 
          }
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
