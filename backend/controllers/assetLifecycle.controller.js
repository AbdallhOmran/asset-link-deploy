const assetLifecycleService = require("../services/assetLifecycle.service");

// PATCH /asset-lifecycle/:id/status - by Eman
const updateAssetStatus = async (req, res) => {
  try {
    const asset = await assetLifecycleService.updateAssetStatus(
      req.params.id,
      req.body.status
    );
    return res.status(200).json({
      success: true,
      message: "Asset status updated successfully",
      data: asset,
    });
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({ success: false, message: err.message });
  }
};

// PATCH /asset-lifecycle/:id/complete-maintenance - by Eman
const completeMaintenanceAndActivate = async (req, res) => {
  try {
    const asset = await assetLifecycleService.completeMaintenanceAndActivate(
      req.params.id
    );
    return res.status(200).json({
      success: true,
      message: "Maintenance completed, asset is now available",
      data: asset,
    });
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({ success: false, message: err.message });
  }
};

// PATCH /asset-lifecycle/:id/health - by Eman
const evaluateAssetHealth = async (req, res) => {
  try {
    const asset = await assetLifecycleService.evaluateAssetHealth(
      req.params.id,
      req.body.healthScore
    );
    return res.status(200).json({
      success: true,
      message: "Asset health evaluated successfully",
      data: asset,
    });
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({ success: false, message: err.message });
  }
};

// PATCH /asset-lifecycle/:id/retire - by Eman
const retireAsset = async (req, res) => {
  try {
    const asset = await assetLifecycleService.retireAsset(
      req.params.id,
      req.body.reason
    );
    return res.status(200).json({
      success: true,
      message: "Asset retired successfully",
      data: asset,
    });
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({ success: false, message: err.message });
  }
};

// GET /asset-lifecycle/:id/replacement-recommendation - by Eman
const getReplacementRecommendation = async (req, res) => {
  try {
    const recommendation = await assetLifecycleService.getReplacementRecommendation(
      req.params.id
    );
    return res.status(200).json({ success: true, data: recommendation });
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({ success: false, message: err.message });
  }
};

module.exports = {
  updateAssetStatus,
  completeMaintenanceAndActivate,
  evaluateAssetHealth,
  retireAsset,
  getReplacementRecommendation,
};