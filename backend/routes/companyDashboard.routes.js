const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");

const {
  getCompanyReputation,
  getCompanyRating,
  getDelayedCompanies,
  getAverageRentalDuration,
  getDashboardStatistics
} = require("../controllers/companyDashboard.controller");

// NOTE: Specific routes (e.g., /delayed, /statistics) MUST be defined BEFORE parametric routes (e.g., /:companyId/...)
// to prevent Express from treating "delayed" or "statistics" as a companyId parameter.

// GET /api/company-dashboard/delayed
router.get("/delayed", authMiddleware, getDelayedCompanies);

// GET /api/company-dashboard/:companyId/statistics
router.get("/:companyId/statistics", authMiddleware, getDashboardStatistics);

// GET /api/company-dashboard/:companyId/reputation
router.get("/:companyId/reputation", authMiddleware, getCompanyReputation);

// GET /api/company-dashboard/:companyId/rating
router.get("/:companyId/rating", authMiddleware, getCompanyRating);

// GET /api/company-dashboard/:companyId/rental-duration
router.get("/:companyId/rental-duration", authMiddleware, getAverageRentalDuration);

module.exports = router;
