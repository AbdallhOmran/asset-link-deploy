const Asset = require("../models/asset.model");
const AssetHealth = require("../models/assetHealth.model");

const createAssetHealth = async (data) => {

    const asset = await Asset.findById(data.assetId);

    if (!asset) {
        throw new Error("Asset not found");
    }

    const existingHealth = await AssetHealth.findOne({
        assetId: data.assetId
    });

    if (existingHealth) {
        throw new Error("Asset Health already exists");
    }

    let healthScore = 100;

    healthScore -= data.maintenanceCount * 5;

    healthScore -= data.breakdownCount * 10;

    if (healthScore < 0) {
        healthScore = 0;
    }

    let recommendation = "Healthy";


    if (data.usageHours >= 1000) {
        recommendation = "Maintenance Required";
    }


    if (healthScore <= 30) {
        recommendation = "Recommend Replacement";
    }


    if (data.totalMaintenanceCost >= 50000) {
        recommendation = "Recommend Selling";
    }

    const assetHealth = await AssetHealth.create({
        assetId: data.assetId,
        usageHours: data.usageHours,
        breakdownCount: data.breakdownCount,
        maintenanceCount: data.maintenanceCount,
        totalMaintenanceCost: data.totalMaintenanceCost,
        healthScore,
        recommendation
    });
    return assetHealth;
};
const updateAssetHealth = async (assetId, data) => {

    const assetHealth = await AssetHealth.findOne({ assetId });

    if (!assetHealth) {
        throw new Error("Asset Health not found");
    }

    assetHealth.usageHours += data.usageHours || 0;
    assetHealth.breakdownCount += data.breakdownCount || 0;
    assetHealth.maintenanceCount += data.maintenanceCount || 0;
    assetHealth.totalMaintenanceCost += data.totalMaintenanceCost || 0;

    let healthScore = 100;

    healthScore -= assetHealth.maintenanceCount * 5;
    healthScore -= assetHealth.breakdownCount * 10;

    if (healthScore < 0) {
        healthScore = 0;
    }

    assetHealth.healthScore = healthScore;

    if (assetHealth.totalMaintenanceCost >= 50000) {
        assetHealth.recommendation = "Recommend Selling";
    } else if (assetHealth.healthScore <= 30) {
        assetHealth.recommendation = "Recommend Replacement";
    } else if (assetHealth.usageHours >= 1000) {
        assetHealth.recommendation = "Maintenance Required";
    } else {
        assetHealth.recommendation = "Healthy";
    }
    await assetHealth.save();

    return assetHealth;
};

module.exports = {createAssetHealth , updateAssetHealth};