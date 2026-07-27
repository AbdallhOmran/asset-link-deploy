const mongoose = require("mongoose");
const contractModel = require("../models/contract.model");
const assetModel = require("../models/asset.model");
const maintenanceModel = require("../models/maintenance.model");

const getAssetUsageReport = async () => {
  const pipeline = [
    { $match: { status: { $in: ["Active", "Completed"] } } },
    {
      $group: {
        _id: "$assetId",
        rentalCount: { $sum: 1 },
        totalRevenue: { $sum: "$totalPrice" }
      }
    },
    {
      $lookup: {
        from: "assets",
        localField: "_id",
        foreignField: "_id",
        as: "asset"
      }
    },
    { $unwind: "$asset" },
    {
      $project: {
        assetName: "$asset.assetName",
        assetCode: "$asset.assetCode",
        rentalCount: 1,
        totalRevenue: 1
      }
    },
    { $sort: { rentalCount: -1 } } 
  ];

  const results = await contractModel.aggregate(pipeline);

  return {
    mostUsed: results.slice(0, 5),
    leastUsed: results.slice(-5).reverse() 
  };
};

const getAssetUtilization = async () => {
  const pipeline = [
    { $match: { status: { $in: ["Active", "Completed"] } } },
    {
      $project: {
        assetId: 1,

        rentedDays: {
          $round: [
            { $divide: [{ $subtract: ["$endDate", "$startDate"] }, 1000 * 60 * 60 * 24] },
            0
          ]
        }
      }
    },
    {
      $group: {
        _id: "$assetId",
        totalRentedDays: { $sum: "$rentedDays" }
      }
    },
    {
      $lookup: {
        from: "assets",
        localField: "_id",
        foreignField: "_id",
        as: "asset"
      }
    },
    { $unwind: "$asset" },
    {
      $project: {
        assetName: "$asset.assetName",
        totalRentedDays: 1,

        utilizationPercentage: {
          $round: [{ $multiply: [{ $divide: ["$totalRentedDays", 365] }, 100] }, 2]
        }
      }
    },
    { $sort: { utilizationPercentage: -1 } }
  ];

  return await contractModel.aggregate(pipeline);
};

const getMaintenanceCostReport = async () => {
  const pipeline = [
    { $match: { status: "Completed" } },
    {
      $group: {
        _id: "$assetId",
        totalMaintenanceCost: { $sum: "$cost" }, 
        maintenanceCount: { $sum: 1 } 
      }
    },
    {
      $lookup: {
        from: "assets",
        localField: "_id",
        foreignField: "_id",
        as: "asset"
      }
    },
    { $unwind: "$asset" },
    {
      $project: {
        assetName: "$asset.assetName",
        totalMaintenanceCost: 1,
        maintenanceCount: 1,
        healthScore: "$asset.healthScore"
      }
    },
    { $sort: { totalMaintenanceCost: -1 } }
  ];

  return await maintenanceModel.aggregate(pipeline);
};

const getReplacementCandidates = async () => {

  return await assetModel.find({
    $or: [
      { healthScore: { $lte: 40 } }, 
      { status: "Inactive" }, 
      { recommendation: "Replacement" } 
    ]
  })
  .select("assetName assetCode healthScore status usageHours")
  .sort({ healthScore: 1 })
  .lean();
};

module.exports = {
  getAssetUsageReport,
  getAssetUtilization,
  getMaintenanceCostReport,
  getReplacementCandidates
};