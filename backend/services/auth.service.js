const bcrypt = require("bcryptjs");
const Company = require('../models/company.model');
const crypto = require("crypto");
const { setCache, getCache, deleteCache } = require('../utils/cache.util');
const { sendResetPasswordEmail } = require('../utils/sendEmail.util');
const otpService = require('./otp.service');

/**
 * Register a new company
 * - Checks if email already exists in DB
 * - Checks if email already has a pending registration in Cache
 * - Hashes the password
 * - Generates OTP
 * - Stores everything in Redis Cache (TTL 5 min)
 * - Sends OTP via email (or console in dev)
 */
const registerCompany = async (data) => {
  const { companyName, companyEmail, phoneNumber, password, commercialRegistrationNumber, taxRegister, companyAddress, companyType } = data;

  // 1. Check if email already exists in DB
  const existingCompany = await Company.findOne({ companyEmail });
  if (existingCompany) {
    throw { statusCode: 409, message: 'Email is already registered' };
  }

  // 2. Check if there's already a pending registration in cache
  const pendingRegistration = await getCache(`register:${companyEmail}`);
  if (pendingRegistration) {
    throw { statusCode: 409, message: 'A registration is already pending for this email. Please verify OTP or wait for it to expire.' };
  }

  // 3. Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 4. Generate and send OTP using generic OTP service
  await otpService.generateAndSendOtp(companyEmail, 'registration');

  // 5. Store pending company data in Redis Cache (without OTP)
  const cacheData = {
    companyName,
    companyEmail,
    phoneNumber,
    password: hashedPassword,
    commercialRegistrationNumber: commercialRegistrationNumber || undefined,
    taxRegister: taxRegister || undefined,
    companyAddress: companyAddress || undefined,
    companyType: companyType || "Both",
  };

  await setCache(`register:${companyEmail}`, cacheData);

  return { message: 'OTP sent successfully. Please check your email.' };
};

/**
 * Verify OTP and create company in database
 */
const verifyOtp = async (email, otp) => {
  const cachedData = await getCache(`register:${email}`);
  if (!cachedData) {
    throw { statusCode: 400, message: 'Registration data expired. Please register again.' };
  }

  // Verify OTP via generic service
  await otpService.verifyOtp(email, otp, 'registration');

  const company = await Company.create({
    companyName: cachedData.companyName,
    companyEmail: cachedData.companyEmail,
    phoneNumber: cachedData.phoneNumber,
    password: cachedData.password,
    commercialRegistrationNumber: cachedData.commercialRegistrationNumber || undefined,
    taxRegister: cachedData.taxRegister || undefined,
    companyAddress: cachedData.companyAddress || undefined,
    companyType: cachedData.companyType,
    isVerified: true,
  });

  await deleteCache(`register:${email}`);

  return {
    message: 'Company registered and verified successfully',
    company: {
      id: company._id,
      companyName: company.companyName,
      companyEmail: company.companyEmail,
      isVerified: company.isVerified,
    },
  };
};

/**
 * Resend OTP
 */
const resendOtp = async (email) => {
  const cachedData = await getCache(`register:${email}`);
  if (!cachedData) {
    throw { statusCode: 400, message: 'No pending registration found. Please register first.' };
  }

  await otpService.generateAndSendOtp(email, 'registration');

  return { message: 'New OTP sent successfully. Please check your email.' };
};

/**
 * Forgot Password
 */
const forgotPassword = async (email) => {

  const company = await Company.findOne({ companyEmail: email });

  if (!company) {
    throw {
      statusCode: 404,
      message: "Company not found"
    };
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  company.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  company.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  await company.save();

  const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  await sendResetPasswordEmail(company.companyEmail, resetLink);

  return {
    message: "Password reset link sent to your email"
  };

};

/**
 * Reset Password
 */
const resetPassword = async (token, newPassword) => {

  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const company = await Company.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!company) {
    throw {
      statusCode: 400,
      message: "Invalid or expired reset token"
    };
  }

  const salt = await bcrypt.genSalt(10);
  company.password = await bcrypt.hash(newPassword, salt);

  company.resetPasswordToken = undefined;
  company.resetPasswordExpire = undefined;

  await company.save();

  return {
    message: "Password has been reset successfully"
  };

};

module.exports = {
  registerCompany,
  verifyOtp,
  resendOtp,
  forgotPassword,
  resetPassword
};