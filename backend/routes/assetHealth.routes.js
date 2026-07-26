const express = require("express");
const router = express.Router();

const assetHealthController = require("../controllers/assetHealth.controller");

router.post("/create", assetHealthController.createAssetHealth);
router.put("/update/:assetId", assetHealthController.updateAssetHealth);
module.exports = router;