const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");

const {
  getAssetUsage,
  getAssetUtilization,
  getMaintenanceCost,
  getReplacementCandidates
} = require("../controllers/assetReport.controller");

router.use(authMiddleware);

router.get("/usage", getAssetUsage);
router.get("/utilization", getAssetUtilization);
router.get("/maintenance-cost", getMaintenanceCost);
router.get("/replacements", getReplacementCandidates);

module.exports = router;