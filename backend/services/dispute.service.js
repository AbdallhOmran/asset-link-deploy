const disputeModel = require("../models/dispute.model");
const bookingModel = require("../models/booking.model");
const escrowModel = require("../models/escrow.model");
const escrowService = require("./escrow.service");

const openDispute = async (disputeData) => {
  const { bookingId, raisedBy, reason } = disputeData;

  // Validation — required fields
  if (!bookingId) throw new Error("bookingId is required");
  if (!raisedBy) throw new Error("raisedBy is required");
  if (!reason) throw new Error("reason is required");

  // Validation — booking must exist
  const booking = await bookingModel.findById(bookingId);
  if (!booking) throw new Error("Booking not found");

  // Create the dispute document with status "Open"
  const newDispute = new disputeModel({
    bookingId,
    raisedBy,
    reason,
    status: "Open"
  });

  await newDispute.save();

  // Business Rule: في حالة وجود نزاع يتم تجميد المبلغ
  // Only freeze AFTER the dispute is successfully saved
  const escrow = await escrowModel.findOne({ bookingId });
  if (escrow) {
    await escrowService.freezeMoney(escrow._id);
  }

  return newDispute;
};

const resolveDispute = async (disputeId, resolveData) => {
  const { resolution, resolutionNotes } = resolveData;

  // Validation — dispute must exist
  const dispute = await disputeModel.findById(disputeId);
  if (!dispute) throw new Error("Dispute not found");

  // Validation — dispute must be Open
  if (dispute.status !== "Open") {
    throw new Error("Invalid operation. Dispute is already resolved");
  }

  // Validation — resolution must be valid
  const VALID_RESOLUTIONS = ["ReleaseMoney", "Refund"];
  if (!resolution || !VALID_RESOLUTIONS.includes(resolution)) {
    throw new Error("Invalid resolution. Must be one of: ReleaseMoney, Refund");
  }

  // Update the dispute
  dispute.status = "Resolved";
  dispute.resolution = resolution;
  if (resolutionNotes) {
    dispute.resolutionNotes = resolutionNotes;
  }

  await dispute.save();

  // Execute the resolution action on the escrow
  let updatedEscrow = null;

  if (resolution === "ReleaseMoney") {
    // Release funds to the owner company
    updatedEscrow = await escrowService.releaseMoney(dispute.bookingId);
  } else if (resolution === "Refund") {
    // Refund funds to the renting company
    const escrow = await escrowModel.findOne({ bookingId: dispute.bookingId });
    if (!escrow) throw new Error("Escrow not found");

    updatedEscrow = await escrowService.updateEscrowStatus(escrow._id, "Refunded");
  }

  return { dispute, escrow: updatedEscrow };
};

module.exports = {
  openDispute,
  resolveDispute,
};
