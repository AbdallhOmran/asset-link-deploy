const nodemailer = require('nodemailer');
require('dotenv').config();

/**
 * Check if email credentials are still placeholders
 * @returns {boolean}
 */
const isPlaceholder = () => {
  const user = process.env.EMAIL_USER || '';
  const pass = process.env.EMAIL_PASS || '';
  return (
    !user ||
    !pass ||
    user === 'PUT_YOUR_EMAIL_HERE' ||
    pass === 'PUT_YOUR_APP_PASSWORD_HERE'
  );
};

/**
 * Create Nodemailer transporter using SMTP settings from .env
 * @returns {object} Nodemailer transporter
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Build the OTP verification email HTML template
 * @param {string} otp - 6-digit OTP code
 * @returns {string} HTML email body
 */
const buildOTPEmailHTML = (otp) => {
  const otpDigits = otp.split('').map((digit) => {
    return `<td style="width:45px;height:55px;text-align:center;font-size:28px;font-weight:700;color:#1a1a2e;background-color:#f0f4ff;border:2px solid #4361ee;border-radius:10px;font-family:'Segoe UI',Arial,sans-serif;">${digit}</td>`;
  }).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AssetLink - Verify Your Company</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6fc;font-family:'Segoe UI',Roboto,Arial,sans-serif;">

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4f6fc;padding:40px 0;">
    <tr>
      <td align="center">

        <!-- Main Card -->
        <table role="presentation" width="480" cellspacing="0" cellpadding="0" style="background-color:#ffffff;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,0.08);overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#4361ee 0%,#3a0ca3 100%);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;font-size:28px;font-weight:700;color:#ffffff;letter-spacing:1px;">
                🔗 AssetLink
              </h1>
              <p style="margin:8px 0 0;font-size:14px;color:rgba(255,255,255,0.85);font-weight:400;">
                Asset Management Platform
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px 20px;">
              <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#1a1a2e;">
                Verify Your Company
              </h2>
              <p style="margin:0 0 28px;font-size:15px;color:#555;line-height:1.6;">
                Welcome to <strong>AssetLink</strong>! Use the verification code below to complete your company registration.
              </p>

              <!-- OTP Box -->
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 auto 28px;">
                <tr>
                  ${otpDigits}
                </tr>
              </table>

              <!-- Expiry Notice -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background-color:#fff8e6;border-left:4px solid #f59e0b;border-radius:8px;padding:14px 18px;">
                    <p style="margin:0;font-size:14px;color:#92400e;line-height:1.5;">
                      ⏳ This code expires in <strong>5 minutes</strong>. Do not share it with anyone.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none;border-top:1px solid #eee;margin:0;" />
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px 32px;text-align:center;">
              <p style="margin:0 0 4px;font-size:12px;color:#999;">
                If you didn't request this code, please ignore this email.
              </p>
              <p style="margin:0;font-size:12px;color:#bbb;">
                &copy; ${new Date().getFullYear()} AssetLink. All rights reserved.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
  `.trim();
};

/**
 * Send OTP verification email to a company
 * In development mode (placeholder credentials), prints OTP to console instead.
 *
 * @param {string} toEmail - Recipient email address
 * @param {string} otp - 6-digit OTP code
 */
const sendOTPEmail = async (toEmail, otp) => {
  try {
    // Development fallback: print OTP to console if credentials are placeholders
    if (isPlaceholder()) {
      console.log('========================================');
      console.log(`📧 OTP for ${toEmail} : ${otp}`);
      console.log('========================================');
      return;
    }

    // Production: send real email via Gmail SMTP
    const transporter = createTransporter();
    const fromName = process.env.EMAIL_FROM_NAME || 'AssetLink';

    await transporter.sendMail({
      from: `"${fromName}" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: 'AssetLink - Verify Your Company',
      html: buildOTPEmailHTML(otp),
    });

    console.log(`✅ OTP email sent successfully to ${toEmail}`);
  } catch (error) {
    console.error(`❌ Failed to send OTP email to ${toEmail}:`, error.message);
    throw { statusCode: 500, message: 'Failed to send verification email. Please try again later.' };
  }
};

/**
 * Send Reset Password Email
 */
const sendResetPasswordEmail = async (toEmail, resetLink) => {
  try {

    if (isPlaceholder()) {
      console.log("========================================");
      console.log(`📧 Reset Password Link for ${toEmail}`);
      console.log(resetLink);
      console.log("========================================");
      return;
    }

    const transporter = createTransporter();
    const fromName = process.env.EMAIL_FROM_NAME || "AssetLink";

    await transporter.sendMail({
      from: `"${fromName}" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "AssetLink - Reset Password",
      html: `
        <h2>Reset Your Password</h2>

        <p>You requested to reset your password.</p>

        <p>
          <a href="${resetLink}">
            Click here to reset your password
          </a>
        </p>

        <p>This link will expire in 15 minutes.</p>
      `
    });

    console.log(`✅ Reset Password email sent successfully to ${toEmail}`);

  } catch (error) {

    console.error(error);

    throw {
      statusCode: 500,
      message: "Failed to send reset password email."
    };

  }
};

/**
 * Send Waitlist Notification Email
 */
const sendWaitlistNotificationEmail = async (toEmail, companyName, assetName, ownerEmail) => {
  try {
    if (isPlaceholder()) {
      console.log("========================================");
      console.log(`📧 Waitlist Notification for ${companyName} (${toEmail})`);
      console.log(`Asset: ${assetName} is now available!`);
      console.log("========================================");
      return;
    }

    const transporter = createTransporter();
    const fromName = process.env.EMAIL_FROM_NAME || "AssetLink";

    await transporter.sendMail({
      from: `"${fromName}" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: `AssetLink - Waitlist Update: ${assetName} is Available!`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Great news, ${companyName}!</h2>
          <p>The asset you've been waiting for, <strong>${assetName}</strong>, is now available.</p>
          <p>Please contact the owner immediately at <a href="mailto:${ownerEmail}">${ownerEmail}</a> to finalize your booking before it goes to the next company in line.</p>
          <br>
          <p>Best regards,<br>The AssetLink Team</p>
        </div>
      `
    });
    console.log(`✅ Waitlist Notification email sent successfully to ${toEmail}`);
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  sendOTPEmail,
  sendResetPasswordEmail,
  sendWaitlistNotificationEmail
};