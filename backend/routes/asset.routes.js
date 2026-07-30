const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const {
  addAsset,
  getAssetDetails,
  updateAsset,
  getAssets,
  searchAssets,
  getAssetAvailability,
  getRecommendedAssets,
  getMyAssets
} = require("../controllers/asset.controller");

router.post("/", authMiddleware, addAsset);
router.get("/",authMiddleware, getAssets);
router.get("/search", authMiddleware, searchAssets);
router.get("/my-assets", authMiddleware, getMyAssets);
router.get("/recommended",authMiddleware, getRecommendedAssets);
router.get("/:id/availability",authMiddleware, getAssetAvailability);
router.get("/:id",authMiddleware, getAssetDetails);
router.put("/:id", authMiddleware, updateAsset);

module.exports = router;