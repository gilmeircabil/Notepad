import nodemailer from "nodemailer";

/**
 * Creates and returns a nodemailer transporter.
 * Supports Gmail, Brevo, or generic SMTP out-of-the-box at zero cost.
 */
const createTransporter = () => {
  const isGmail =
    process.env.EMAIL_SERVICE === "gmail" ||
    (!process.env.SMTP_HOST && process.env.EMAIL_USER?.includes("@gmail.com"));
  const user = process.env.EMAIL_USER?.trim();
  const rawPass = process.env.EMAIL_PASS?.trim();
  // Strip whitespace from Gmail app passwords (e.g. 'xxxx xxxx xxxx xxxx')
  const pass = isGmail ? rawPass?.replace(/\s+/g, "") : rawPass;

  if (user && pass) {
    if (isGmail && !process.env.SMTP_HOST) {
      return nodemailer.createTransport({
        service: "gmail",
        auth: { user, pass },
      });
    }

    const host = process.env.SMTP_HOST || "smtp.gmail.com";
    return nodemailer.createTransport({
      host,
      port: parseInt(process.env.SMTP_PORT || "587", 10),
      secure: process.env.SMTP_SECURE === "true",
      auth: { user, pass },
    });
  }

  return null;
};

/**
 * Sends a password reset email to the user.
 * If SMTP credentials are not configured, it prints the link to the console for testing.
 */
export const sendPasswordResetEmail = async ({ toEmail, resetLink, userName }) => {
  const transporter = createTransporter();
  const fromAddress = process.env.EMAIL_FROM || `"NotePad" <${process.env.EMAIL_USER || "noreply@notepad.app"}>`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 24px; }
          .container { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 20px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
          .header { text-align: center; margin-bottom: 24px; }
          .logo { display: inline-block; font-size: 22px; font-weight: bold; color: #0f172a; text-decoration: none; }
          .logo span { color: #2563eb; }
          .title { font-size: 18px; font-weight: bold; color: #0f172a; margin-top: 16px; margin-bottom: 8px; }
          .text { font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 20px 0; }
          .btn-container { text-align: center; margin: 28px 0; }
          .btn { display: inline-block; background-color: #2563eb; color: #ffffff !important; font-size: 14px; font-weight: 600; text-decoration: none; padding: 12px 28px; border-radius: 12px; }
          .warning { font-size: 12px; color: #64748b; background: #f1f5f9; padding: 12px 16px; border-radius: 10px; margin-top: 24px; line-height: 1.5; }
          .footer { font-size: 11px; text-align: center; color: #94a3b8; margin-top: 24px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Note<span>Pad</span></div>
            <div class="title">Reset Your Password</div>
          </div>
          <p class="text">Hi ${userName || "there"},</p>
          <p class="text">We received a request to reset your password for your NotePad account. Click the button below to choose a new password:</p>
          
          <div class="btn-container">
            <a href="${resetLink}" class="btn" target="_blank">Reset Password</a>
          </div>

          <p class="text" style="font-size: 12px; color: #64748b;">This link is valid for <strong>15 minutes</strong>. If the button above doesn't work, copy and paste this URL into your browser:</p>
          <p class="text" style="font-size: 11px; word-break: break-all; color: #2563eb;">${resetLink}</p>

          <div class="warning">
            If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.
          </div>

          <div class="footer">
            © ${new Date().getFullYear()} NotePad. All rights reserved.
          </div>
        </div>
      </body>
    </html>
  `;

  if (transporter) {
    await transporter.sendMail({
      from: fromAddress,
      to: toEmail,
      subject: "Reset your NotePad password",
      html: htmlContent,
      text: `Hi ${userName || "there"},\n\nReset your NotePad password by visiting this link (valid for 15 minutes):\n${resetLink}\n\nIf you did not request this, please ignore this email.`,
    });
    console.info(`[email] Password reset email sent to ${toEmail}`);
  } else {
    // Zero-cost development & fallback mode: output to console
    console.info("\n============================================================");
    console.info(`[EMAIL ZERO-COST DISPATCH]`);
    console.info(`To: ${toEmail}`);
    console.info(`Reset Link: ${resetLink}`);
    console.info(`(To send via real inbox, add EMAIL_USER and EMAIL_PASS to Render or .env)`);
    console.info("============================================================\n");
  }
};
