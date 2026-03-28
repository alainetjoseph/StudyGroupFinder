/**
 * Generates a styled HTML email template.
 * @param {Object} options - Template options.
 * @param {string} options.title - Email heading.
 * @param {string} options.text - Main body text.
 * @param {string} [options.theme="dark"] - "light" or "dark".
 * @param {Object} [options.cta] - Call to action button.
 * @param {string} options.cta.text - Button label.
 * @param {string} options.cta.link - Button URL.
 * @returns {string} HTML string.
 */
function generateEmailHTML({ title, text, theme = "dark", cta }) {
  const isDark = theme === "dark";

  const styles = {
    bg: isDark ? "#0f172a" : "#f9fafb",
    card: isDark ? "#1f2937" : "#ffffff",
    text: isDark ? "#e5e7eb" : "#111827",
    subText: isDark ? "#9ca3af" : "#6b7280",
    accent: "#6366f1",
  };

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
  </head>
  <body style="background:${styles.bg}; margin:0; padding:40px; font-family: 'Inter', Arial, sans-serif; -webkit-font-smoothing: antialiased;">
    <div style="max-width:600px; margin:auto; background:${styles.card}; border-radius:12px; padding:32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
      
      <h2 style="color:${styles.text}; margin-top:0; margin-bottom:16px; font-size:24px; font-weight:700;">
        ${title}
      </h2>

      <p style="color:${styles.subText}; line-height:1.6; font-size:16px; margin-bottom:24px;">
        ${text}
      </p>

      ${
        cta
          ? `<div style="margin-top:24px;">
               <a href="${cta.link}" 
                  style="display:inline-block;
                         padding:12px 24px;
                         background:${styles.accent};
                         color:#ffffff;
                         text-decoration:none;
                         border-radius:8px;
                         font-weight:600;
                         font-size:16px;">
                  ${cta.text}
               </a>
             </div>`
          : ""
      }

      <div style="margin-top:40px; padding-top:24px; border-top:1px solid ${isDark ? "#374151" : "#e5e7eb"};">
        <p style="font-size:12px; color:${styles.subText}; margin:0;">
          This is an automated email. Please do not reply.
        </p>
      </div>

    </div>
  </body>
  </html>
  `;
}

module.exports = { generateEmailHTML };
