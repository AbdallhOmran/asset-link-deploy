const bookingModel = require("../models/booking.model");
const assetModel = require("../models/asset.model");
const contractModel = require("../models/contract.model");
const bookingService = require("./booking.service");

// External models merged
const inspectionModel = require("../models/inspection.model");
// const damageModel = require("../models/damage.model");
// const penaltyModel = require("../models/penalty.model");
// const maintenanceModel = require("../models/maintenance.model");

const makeError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

const returnAsset = async (bookingId) => {
  const booking = await bookingModel.findById(bookingId);
  if (!booking) throw makeError("Booking not found", 404);

  // Active rental state is "Confirmed"
  if (booking.status !== "Confirmed") {
    throw makeError("Invalid operation. Booking is not in an active rental state.", 400);
  }

  // Mark the return event without changing the enum status
  booking.returnedAt = new Date();
  await booking.save();

  return booking;
};

const completeRental = async (bookingId) => {
  const booking = await bookingModel.findById(bookingId);
  if (!booking) throw makeError("Booking not found", 404);

  // 1. Verify Final Inspection completion
  const inspectionModel = require("../models/inspection.model");
  const finalInspection = await inspectionModel.findOne({ bookingId, inspectionType: "after_return" });
  if (!finalInspection || (finalInspection.status !== "Passed" && finalInspection.status !== "completed")) {
    throw makeError("Invalid operation. Final inspection must be completed/passed before closing the rental", 400);
  }

  // 2. Damage decision
  if (finalInspection.hasDamage) {
     throw makeError("Cannot complete rental while there is unresolved damage. Please resolve penalties first.", 400);
  }

  // 3. No damage (or damage resolved)
  // Reuse existing booking service for status update
  const updatedBooking = await bookingService.updateBookingStatus(booking._id, { status: "Completed" });
  
  // Update Asset status using the existing pattern found in the codebase
  const updatedAsset = await assetModel.findByIdAndUpdate(
    booking.assetId,
    { status: "Available" },
    { new: true }
  );

  // Update Contract status to "Completed"
  const updatedContract = await contractModel.findOneAndUpdate(
    { bookingId: booking._id },
    { status: "Completed" },
    { new: true }
  );

  return { booking: updatedBooking, asset: updatedAsset, contract: updatedContract };
};

module.exports = {
  returnAsset,
  completeRental
};
