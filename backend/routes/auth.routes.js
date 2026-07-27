const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');

// POST /api/auth/register-company
router.post('/register-company', authController.registerCompany);

// POST /api/auth/verify-otp
router.post('/verify-otp', authController.verifyOtp);

// POST /api/auth/resend-otp
router.post('/resend-otp', authController.resendOtp);

router.post('/login', authController.login);
router.post("/forgot-password", authController.forgotPassword);

router.post('/forgot-password', authController.forgotPassword);
router.put("/reset-password/:token", authController.resetPassword);
module.exports = router;
