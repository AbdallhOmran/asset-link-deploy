const bcrypt = require("bcryptjs");
const Company = require('../models/company.model');
const generateToken = require('../utils/generateToken');
const authService = require('../services/auth.service');
const inspectorModel = require('../models/inspector.model')
/**
 * Register Company Controller
 * POST /api/auth/register-company
 */
const registerCompany = async (req, res) => {
  try {
    const { companyName, companyEmail, phoneNumber, password, confirmPassword, commercialRegistrationNumber, companyAddress } = req.body;

    // --- Input Validation ---

    // Required fields check
    if (!companyName || !companyEmail || !phoneNumber || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided (companyName, companyEmail, phoneNumber, password, confirmPassword)',
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(companyEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
    }

    // Password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      });
    }

    // Password strength validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character',
      });
    }

    // Phone format validation
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format (10-15 digits required)',
      });
    }

    // --- Call Service ---
    const result = await authService.registerCompany({
      companyName,
      companyEmail: companyEmail.toLowerCase(),
      phoneNumber,
      password,
      commercialRegistrationNumber,
      companyAddress,
    });

    return res.status(200).json({
      success: true,
      ...result,
    });

  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal server error';
    return res.status(statusCode).json({
      success: false,
      message,
    });
  }
};

/**
 * Verify OTP Controller
 * POST /api/auth/verify-otp
 */
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // --- Input Validation ---
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required',
      });
    }

    // OTP format: 6 digits
    const otpRegex = /^\d{6}$/;
    if (!otpRegex.test(otp)) {
      return res.status(400).json({
        success: false,
        message: 'OTP must be exactly 6 digits',
      });
    }

    // --- Call Service ---
    const result = await authService.verifyOtp(email.toLowerCase(), otp);

    return res.status(201).json({
      success: true,
      ...result,
    });

  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal server error';
    return res.status(statusCode).json({
      success: false,
      message,
    });
  }
};

/**
 * Resend OTP Controller
 * POST /api/auth/resend-otp
 */
const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // --- Input Validation ---
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    // --- Call Service ---
    const result = await authService.resendOtp(email.toLowerCase());

    return res.status(200).json({
      success: true,
      ...result,
    });

  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal server error';
    return res.status(statusCode).json({
      success: false,
      message,
    });
  }
};


const login = async (req, res) => {
    try {
    const { companyEmail, password } = req.body;

    if (!companyEmail || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    //find the company by email
    const company = await Company.findOne({ companyEmail });
    if (!company) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    //check if the company is verified
    if (!company.isVerified) {
        return res.status(403).json({ message: 'Your account is not verified yet' });
    }
    //check if the password matches
    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    //generate token using the generateToken utility function
    const token = generateToken(company._id, company.role);

    //return the token and company details in the response
    res.status(200).json({
        message: 'Login successful',
        token,
        company: {
        id: company._id,
        companyName: company.companyName,
        companyEmail: company.companyEmail,
        role: company.role
        }
    });

    } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const inspectorLogin = async (req, res) => {
  try {
    const { inspectorEmail, password } = req.body;

    if (!inspectorEmail || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const inspector = await inspectorModel.findOne({ inspectorEmail });
    if (!inspector) {
      return res.status(400).json({ message: "This inspector not found" });
    }

    const checkPassword = await bcrypt.compare(password, inspector.password);
    if (!checkPassword) {
      return res.status(400).json({ message: "Your email or password is invalid" });
    }

    const token = generateToken(inspector._id, inspector.role);

    return res.status(200).json({
      success: true, 
      message: 'Login successful',
      token,
      inspector: {
        id: inspector._id,
        fullName: inspector.fullName,
        inspectorEmail: inspector.inspectorEmail,
        role: inspector.role
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const result = await authService.forgotPassword(email.toLowerCase());

    return res.status(200).json({
      success: true,
      ...result
    });

  } catch (error) {

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error"
    });

  }
};
const resetPassword = async (req, res) => {
  try {

    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required"
      });
    }

    const result = await authService.resetPassword(token, password);

    return res.status(200).json({
      success: true,
      ...result
    });

  } catch (error) {

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error"
    });

  }
};
module.exports = {
  registerCompany,
  verifyOtp,
  resendOtp,
  login,
  inspectorLogin,
  forgotPassword,
  resetPassword
};