const mongoose = require("mongoose");
const penaltyModel = require("../models/penalty.model");
const assetModel = require("../models/asset.model");
const bookingModel = require("../models/booking.model");
const escrowService = require("./escrow.service");

const makeError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// ==========================================
// FEATURE 1: Calculate Penalty
// ==========================================
const calculatePenalty = (damageCost, securityDeposit) => {
  if (damageCost < 0) return 0;
  if (securityDeposit < 0) return 0;

  // Penalty cannot exceed security deposit
  if (damageCost <= securityDeposit) {
    return damageCost;
  }
  return securityDeposit; // Max penalty is the full deposit
};

// ==========================================
// FEATURE 2: Trigger Maintenance
// ==========================================
const triggerMaintenance = async (assetId) => {
  if (!mongoose.isValidObjectId(assetId)) throw makeError("Invalid assetId", 400);

  const asset = await assetModel.findById(assetId);
  if (!asset) throw makeError("Asset not found", 404);

  // Trigger: Change status to Maintenance using existing findByIdAndUpdate style
  await assetModel.findByIdAndUpdate(assetId, { status: "Maintenance" });

  // TODO: Create Maintenance Request when Maintenance module is merged
};

// ==========================================
// FEATURE 1 & 3: Create Penalty & Apply logic
// ==========================================
const createPenalty = async (data) => {
  const { bookingId, assetId, damageCost, damageLevel } = data;

  if (!bookingId || !assetId || damageCost === undefined) {
    throw makeError("bookingId, assetId, and damageCost are required", 400);
  }
  if (!mongoose.isValidObjectId(bookingId)) throw makeError("Invalid bookingId", 400);
  if (!mongoose.isValidObjectId(assetId)) throw makeError("Invalid assetId", 400);
  if (damageCost <= 0) throw makeError("Damage cost must be greater than zero to apply a penalty", 400);

  const booking = await bookingModel.findById(bookingId);
  if (!booking) throw makeError("Booking not found", 404);

  // 1. Fetch Escrow to get the security deposit
  const escrow = await escrowService.getEscrowByBooking(bookingId);
  
  // 2. Calculate Penalty Amount
  const penaltyAmount = calculatePenalty(damageCost, escrow.securityDeposit);

  // 3. Deduct from Deposit via Escrow Service (Keeps Escrow status pure)
  await escrowService.deductPenaltyFromDeposit(bookingId, penaltyAmount);

  // 4. Record the Penalty
  const penalty = await penaltyModel.create({
    bookingId,
    assetId,
    damageCost,
    penaltyAmount,
    status: "Applied"
  });

  // 5. Trigger Maintenance
  await triggerMaintenance(assetId);

  return penalty;
};

module.exports = {
  createPenalty,
  calculatePenalty,
  triggerMaintenance
};
