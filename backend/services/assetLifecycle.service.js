const mongoose = require("mongoose");
const assetModel = require("../models/asset.model");

const VALID_STATUSES = ["Available", "Booked", "Maintenance", "Inactive"];
const LOW_HEALTH_THRESHOLD = 40; // TODO: راجعي الرقم ده مع الفريق لو فيه معيار متفق عليه

// helper to throw an error with a status code - by Eman
const makeError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// GENERIC status updater with validation - by Eman
const updateAssetStatus = async (assetId, newStatus) => {
  if (!mongoose.isValidObjectId(assetId))
    throw makeError("Invalid asset id", 400);

  if (!VALID_STATUSES.includes(newStatus)) {
    throw makeError(
      `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
      400
    );
  }

  const asset = await assetModel.findById(assetId);
  if (!asset) throw makeError("Asset not found", 404);

  asset.status = newStatus;
  await asset.save();
  return asset;
};

// BUSINESS RULE: after maintenance ends -> Asset becomes Available - by Eman
const completeMaintenanceAndActivate = async (assetId) => {
  if (!mongoose.isValidObjectId(assetId))
    throw makeError("Invalid asset id", 400);

  const asset = await assetModel.findById(assetId);
  if (!asset) throw makeError("Asset not found", 404);

  // BUSINESS RULE: can only move to Available from Maintenance - by Eman
  if (asset.status !== "Maintenance") {
    throw makeError(
      "Asset is not currently under maintenance, cannot mark as available",
      400
    );
  }

  asset.status = "Available";
  await asset.save();
  return asset;
};

// BUSINESS RULE: low health -> force Asset into Maintenance - by Eman
const evaluateAssetHealth = async (assetId, healthScore) => {
  if (!mongoose.isValidObjectId(assetId))
    throw makeError("Invalid asset id", 400);
  if (healthScore === undefined || healthScore === null)
    throw makeError("healthScore is required", 400);
  if (healthScore < 0 || healthScore > 100)
    throw makeError("healthScore must be between 0 and 100", 400);

  const asset = await assetModel.findById(assetId);
  if (!asset) throw makeError("Asset not found", 404);

  asset.healthScore = healthScore;

  // لو المعدة أصلاً Inactive (متقاعدة)، الـ health مبيغيرش الحالة - by Eman
  if (asset.status !== "Inactive" && healthScore < LOW_HEALTH_THRESHOLD) {
    asset.status = "Maintenance";
  }

  await asset.save();
  return asset;
};

// BUSINESS RULE: retire an asset permanently -> Inactive - by Eman
const retireAsset = async (assetId, reason) => {
  if (!mongoose.isValidObjectId(assetId))
    throw makeError("Invalid asset id", 400);

  const asset = await assetModel.findById(assetId);
  if (!asset) throw makeError("Asset not found", 404);

  asset.status = "Inactive";
  await asset.save();

  return asset;
};

// simple replacement recommendation logic - by Eman
const getReplacementRecommendation = async (assetId) => {
  if (!mongoose.isValidObjectId(assetId))
    throw makeError("Invalid asset id", 400);

  const asset = await assetModel.findById(assetId);
  if (!asset) throw makeError("Asset not found", 404);

  const shouldReplace =
    asset.status === "Inactive" || asset.healthScore < LOW_HEALTH_THRESHOLD;

  return {
    assetId: asset._id,
    assetName: asset.assetName,
    currentHealth: asset.healthScore,
    status: asset.status,
    recommendReplacement: shouldReplace,
    reason: shouldReplace
      ? "Asset health is too low or asset is retired"
      : "Asset is in acceptable condition",
  };
};

// GUARD: used by booking flow to prevent renting unavailable assets - by Eman
const ensureAssetAvailableForBooking = async (assetId) => {
  if (!mongoose.isValidObjectId(assetId))
    throw makeError("Invalid asset id", 400);

  const asset = await assetModel.findById(assetId);
  if (!asset) throw makeError("Asset not found", 404);

  if (asset.status !== "Available") {
    throw makeError(
      `Asset cannot be booked. Current status: ${asset.status}`,
      400
    );
  }

  return true;
};

module.exports = {
  updateAssetStatus,
  completeMaintenanceAndActivate,
  evaluateAssetHealth,
  retireAsset,
  getReplacementRecommendation,
  ensureAssetAvailableForBooking,
};