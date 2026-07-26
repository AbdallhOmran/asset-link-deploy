const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");

const {
  getTotalRevenue,
  getMonthlyRevenue,
  getCompanyRevenue,
  getAssetRevenue
} = require("../controllers/revenueReport.controller");

// Specific routes before parametric routes
router.get("/total", authMiddleware, getTotalRevenue);
router.get("/monthly", authMiddleware, getMonthlyRevenue);

// Parametric routes
router.get("/company/:companyId", authMiddleware, getCompanyRevenue);
router.get("/asset/:assetId", authMiddleware, getAssetRevenue);

module.exports = router;
