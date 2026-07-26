const mongoose = require("mongoose");
const companyModel = require("../models/company.model");
const assetModel = require("../models/asset.model");
const bookingModel = require("../models/booking.model");
const contractModel = require("../models/contract.model");
const disputeModel = require("../models/dispute.model");

const makeError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// =========================================
// FEATURE 1: Company Reputation Score
// =========================================
const getCompanyReputation = async (companyId) => {
  if (!mongoose.isValidObjectId(companyId)) throw makeError("Invalid companyId", 400);

  const company = await companyModel.findById(companyId);
  if (!company) throw makeError("Company not found", 404);

  // 1. Completed rentals (Booking Completed)
  const completedRentalsCount = await bookingModel.countDocuments({
    ownerCompanyId: companyId,
    status: "Completed"
  });

  // 2. Delayed rentals (Booking Confirmed & past endDate)
  // Note: Temporary delay detection because returnedAt is unavailable in main branch.
  const delayedRentalsCount = await bookingModel.countDocuments({
    ownerCompanyId: companyId,
    status: "Confirmed",
    endDate: { $lt: new Date() }
  });

  // 3. Damages (Module Missing)
  const damagesCount = 0; // Not available yet

  // 4. Disputes (Open disputes against the company)
  const bookingsIds = await bookingModel.find({ ownerCompanyId: companyId }).distinct("_id");
  const disputesCount = await disputeModel.countDocuments({
    bookingId: { $in: bookingsIds },
    status: "Open"
  });

  // Formula Documentation (as per user feedback):
  // Base Score = 100
  // + 0.5 points per completed rental
  // - 3 points per delayed rental
  // - 5 points per open dispute
  // Min = 0, Max = 100
  
  let baseScore = 100;
  baseScore += (completedRentalsCount * 0.5);
  baseScore -= (delayedRentalsCount * 3);
  baseScore -= (disputesCount * 5);

  const reputationScore = Math.max(0, Math.min(100, baseScore));

  return {
    companyId,
    reputationScore,
    factors: {
      completedRentals: completedRentalsCount,
      delayedRentals: delayedRentalsCount,
      damages: damagesCount,
      disputes: disputesCount
    }
  };
};

// =========================================
// FEATURE 2: Customer Rating
// =========================================
const getCompanyRating = async (companyId) => {
  if (!mongoose.isValidObjectId(companyId)) throw makeError("Invalid companyId", 400);
  
  const company = await companyModel.findById(companyId);
  if (!company) throw makeError("Company not found", 404);

  return {
    available: false,
    message: "Customer rating module is not implemented yet"
  };
};

// =========================================
// FEATURE 3: Delayed Companies
// =========================================
const getDelayedCompanies = async () => {
  // Find all confirmed bookings past their end date
  // Note: Temporary delay calculation until Rental Completion introduces return lifecycle data.
  const delayedBookings = await bookingModel.aggregate([
    {
      $match: {
        status: "Confirmed",
        endDate: { $lt: new Date() }
      }
    },
    {
      $group: {
        _id: "$ownerCompanyId",
        delayedCount: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: "companies", // Must match the collection name in MongoDB
        localField: "_id",
        foreignField: "_id",
        as: "companyInfo"
      }
    },
    {
      $unwind: "$companyInfo"
    },
    {
      $project: {
        companyId: "$_id",
        companyName: "$companyInfo.companyName",
        delayedCount: 1,
        _id: 0
      }
    }
  ]);

  return delayedBookings;
};

// =========================================
// FEATURE 4: Average Rental Duration
// =========================================
const getAverageRentalDuration = async (companyId) => {
  if (!mongoose.isValidObjectId(companyId)) throw makeError("Invalid companyId", 400);

  // Must rely only on existing booking dates where status = "Completed"
  const result = await bookingModel.aggregate([
    {
      $match: {
        ownerCompanyId: new mongoose.Types.ObjectId(companyId),
        status: "Completed",
        startDate: { $exists: true },
        endDate: { $exists: true }
      }
    },
    {
      $project: {
        durationInMs: { $subtract: ["$endDate", "$startDate"] }
      }
    },
    {
      $group: {
        _id: null,
        averageDurationMs: { $avg: "$durationInMs" }
      }
    }
  ]);

  let averageDays = 0;
  if (result.length > 0 && result[0].averageDurationMs) {
    averageDays = result[0].averageDurationMs / (1000 * 60 * 60 * 24);
  }

  return {
    companyId,
    averageDays: Number(averageDays.toFixed(2)) // Keep 2 decimal places
  };
};

// =========================================
// FEATURE 5: Dashboard Statistics
// =========================================
const getDashboardStatistics = async (companyId) => {
  if (!mongoose.isValidObjectId(companyId)) throw makeError("Invalid companyId", 400);

  // Use aggregation/countDocuments for optimized global queries
  const [totalCompanies, totalAssets, totalContracts, totalBookings] = await Promise.all([
    companyModel.countDocuments(),
    assetModel.countDocuments(),
    contractModel.countDocuments(),
    bookingModel.countDocuments()
  ]);

  // Fetch company specific stats to construct the full dashboard view
  const reputationResult = await getCompanyReputation(companyId);
  const durationResult = await getAverageRentalDuration(companyId);
  
  const delayedBookingsCount = await bookingModel.countDocuments({
    ownerCompanyId: companyId,
    status: "Confirmed",
    endDate: { $lt: new Date() }
  });

  return {
    totalCompanies,
    totalAssets,
    totalContracts,
    totalBookings,
    maintenance: {
      available: false,
      message: "Maintenance module not implemented yet"
    },
    reputationScore: reputationResult.reputationScore,
    averageRentalDuration: durationResult.averageDays,
    delayedBookings: delayedBookingsCount
  };
};

module.exports = {
  getCompanyReputation,
  getCompanyRating,
  getDelayedCompanies,
  getAverageRentalDuration,
  getDashboardStatistics
};
