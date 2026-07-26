const mongoose = require("mongoose");
const contractModel = require("../models/contract.model");

// Helper function to build the base pipeline for valid revenue calculations
const getRevenueBasePipeline = () => {
  return [
    // 1. Match only Completed contracts
    { $match: { status: "Completed" } },
    
    // 2. Lookup the corresponding Escrow record to verify funds were actually Released (not Refunded)
    {
      $lookup: {
        from: "escrows",
        localField: "_id",
        foreignField: "contractId",
        as: "escrow"
      }
    },
    
    // 3. Unwind escrow to filter on it
    { $unwind: "$escrow" },
    
    // 4. Ensure escrow is Released
    { $match: { "escrow.status": "Released" } }
  ];
};

const makeError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// ==========================================
// 1. Total Revenue
// ==========================================
const getTotalRevenue = async () => {
  const pipeline = [
    ...getRevenueBasePipeline(),
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalPrice" }
      }
    }
  ];

  const result = await contractModel.aggregate(pipeline);
  return {
    totalRevenue: result.length > 0 ? result[0].totalRevenue : 0
  };
};

// ==========================================
// 2. Monthly Revenue
// ==========================================
const getMonthlyRevenue = async () => {
  const pipeline = [
    ...getRevenueBasePipeline(),
    {
      // Prioritize grouping date: 1. completedAt (if exists in future), 2. endDate, 3. startDate
      $project: {
        totalPrice: 1,
        revenueDate: {
          $cond: {
            if: { $ifNull: ["$completedAt", false] },
            then: "$completedAt",
            else: {
              $cond: {
                if: { $ifNull: ["$endDate", false] },
                then: "$endDate",
                else: "$startDate"
              }
            }
          }
        }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$revenueDate" } },
        revenue: { $sum: "$totalPrice" }
      }
    },
    {
      $sort: { _id: 1 } // Sort chronologically
    },
    {
      $project: {
        month: "$_id",
        revenue: 1,
        _id: 0
      }
    }
  ];

  const result = await contractModel.aggregate(pipeline);
  return { monthlyRevenue: result };
};

// ==========================================
// 3. Revenue Per Company (Asset Owner)
// ==========================================
const getCompanyRevenue = async (companyId) => {
  if (!mongoose.isValidObjectId(companyId)) throw makeError("Invalid companyId", 400);

  const pipeline = [
    ...getRevenueBasePipeline(),
    { $match: { ownerCompanyId: new mongoose.Types.ObjectId(companyId) } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalPrice" }
      }
    }
  ];

  const result = await contractModel.aggregate(pipeline);
  return {
    companyId,
    totalRevenue: result.length > 0 ? result[0].totalRevenue : 0
  };
};

// ==========================================
// 4. Revenue Per Asset
// ==========================================
const getAssetRevenue = async (assetId) => {
  if (!mongoose.isValidObjectId(assetId)) throw makeError("Invalid assetId", 400);

  const pipeline = [
    ...getRevenueBasePipeline(),
    { $match: { assetId: new mongoose.Types.ObjectId(assetId) } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalPrice" },
        completedRentals: { $sum: 1 }
      }
    }
  ];

  const result = await contractModel.aggregate(pipeline);
  
  if (result.length > 0) {
    return {
      assetId,
      totalRevenue: result[0].totalRevenue,
      completedRentals: result[0].completedRentals
    };
  }

  return {
    assetId,
    totalRevenue: 0,
    completedRentals: 0
  };
};

module.exports = {
  getTotalRevenue,
  getMonthlyRevenue,
  getCompanyRevenue,
  getAssetRevenue
};
