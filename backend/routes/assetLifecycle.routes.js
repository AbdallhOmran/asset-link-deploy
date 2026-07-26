const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");

const {
  updateAssetStatus,
  completeMaintenanceAndActivate,
  evaluateAssetHealth,
  retireAsset,
  getReplacementRecommendation,
} = require("../controllers/assetLifecycle.controller");

router.patch("/:id/status", authMiddleware, updateAssetStatus);
router.patch("/:id/complete-maintenance", authMiddleware, completeMaintenanceAndActivate);
router.patch("/:id/health", authMiddleware, evaluateAssetHealth);
router.patch("/:id/retire", authMiddleware, retireAsset);
router.get("/:id/replacement-recommendation", authMiddleware, getReplacementRecommendation);

module.exports = router;