const OtpModel = require('../models/otp.model');
const generateOTP = require('../utils/otp.util');
const { sendOTPEmail } = require('../utils/sendEmail.util');

const MAX_ATTEMPTS = 3;
const OTP_EXPIRY_MINUTES = 10;

/**
 * Generate, save, and send an OTP
 * @param {string} email User's email
 * @param {string} purpose 'registration' | 'password_reset' | 'sensitive_action'
 */
const generateAndSendOtp = async (email, purpose) => {
  // Check if an OTP already exists for this email and purpose
  let existingOtp = await OtpModel.findOne({ email, purpose });

  const code = generateOTP();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  if (existingOtp) {
    existingOtp.code = code;
    existingOtp.expiresAt = expiresAt;
    existingOtp.attempts = 0;
    await existingOtp.save();
  } else {
    await OtpModel.create({
      email,
      code,
      purpose,
      expiresAt,
    });
  }

  // Send OTP via email
  // You might want to customize the email template based on the purpose
  await sendOTPEmail(email, code);
  
  return { message: 'OTP sent successfully. Please check your email.' };
};

/**
 * Verify an OTP
 * @param {string} email User's email
 * @param {string} code OTP code entered by user
 * @param {string} purpose 'registration' | 'password_reset' | 'sensitive_action'
 */
const verifyOtp = async (email, code, purpose) => {
  const otpRecord = await OtpModel.findOne({ email, purpose });

  if (!otpRecord) {
    throw { statusCode: 400, message: 'OTP not found or expired. Please request a new one.' };
  }

  if (otpRecord.attempts >= MAX_ATTEMPTS) {
    await OtpModel.deleteOne({ _id: otpRecord._id });
    throw { statusCode: 400, message: 'Maximum attempts reached. Please request a new OTP.' };
  }

  if (otpRecord.code !== code) {
    otpRecord.attempts += 1;
    await otpRecord.save();
    throw { statusCode: 400, message: 'Invalid OTP code' };
  }

  // If valid, delete it so it can't be reused
  await OtpModel.deleteOne({ _id: otpRecord._id });
  return true;
};

module.exports = {
  generateAndSendOtp,
  verifyOtp
};
