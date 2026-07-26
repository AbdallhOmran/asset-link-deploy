const mongoose = require("mongoose");
const escrowModel = require("../models/escrow.model");
const bookingModel = require("../models/booking.model");
const contractModel = require("../models/contract.model");
const disputeModel = require("../models/dispute.model");

const VALID_STATUSES = ["Held", "Frozen", "Released", "Refunded", "Cancelled"];
const FINAL_STATUSES = ["Released", "Refunded", "Cancelled"];
const APPROVED_STATUSES = ["Active"]; // contract must be Active - matches contract.model.js enum exactly - by Eman
// generate a unique escrow code like ESC-0001 - by Eman
const generateEscrowCode = async () => {
  const lastEscrow = await escrowModel.findOne().sort({ createdAt: -1 });
  if (!lastEscrow) return "ESC-0001";
  const lastNumber = parseInt(lastEscrow.escrowCode.split("-")[1], 10);
  const newNumber = (isNaN(lastNumber) ? 0 : lastNumber) + 1;
  return `ESC-${newNumber.toString().padStart(4, "0")}`;
};

// helper to throw an error with a status code - by Eman
const makeError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// CREATE ESCROW — hold rental amount + security deposit - by Eman
// ⚠️ FIX: rentalAmount & securityDeposit NO LONGER come from req.body (client-controlled input).
// They are now READ DIRECTLY from the contract stored in the database, so the frontend
// cannot manipulate the held amount (e.g. sending 10 EGP instead of the real 10000 EGP).
const createEscrow = async (data) => {
  const { bookingId, contractId, currency } = data;

  // required fields validation - by Eman
  if (!bookingId) throw makeError("bookingId is required", 400);
  if (!contractId) throw makeError("contractId is required", 400);

  // valid object ids - by Eman
  if (!mongoose.isValidObjectId(bookingId))
    throw makeError("Invalid bookingId", 400);
  if (!mongoose.isValidObjectId(contractId))
    throw makeError("Invalid contractId", 400);

  // booking must exist - by Eman
  const booking = await bookingModel.findById(bookingId);
  if (!booking) throw makeError("Booking not found", 404);

  // contract must exist - by Eman
  const contract = await contractModel.findById(contractId);
  if (!contract) throw makeError("Contract not found", 404);

  // BUSINESS RULE: cannot create escrow before contract approval - by Eman
  if (!APPROVED_STATUSES.includes(contract.status)) {
    throw makeError(
      "Escrow can only be created after the contract is approved/active",
      400
    );
  }

  // BUSINESS RULE: hold the full amount once per contract (no duplicate escrow) - by Eman
  const existing = await escrowModel.findOne({ contractId });
  if (existing) {
    throw makeError("Escrow already exists for this contract", 400);
  }

 
const rentalAmount = contract.totalPrice;
const securityDeposit = contract.securityDeposit;

  if (rentalAmount === undefined || rentalAmount === null) {
    throw makeError("Contract does not have a valid rental amount", 400);
  }
  if (securityDeposit === undefined || securityDeposit === null) {
    throw makeError("Contract does not have a valid security deposit", 400);
  }
  if (Number(rentalAmount) < 0) {
    throw makeError("Contract rental amount is invalid", 400);
  }
  if (Number(securityDeposit) < 0) {
    throw makeError("Contract security deposit is invalid", 400);
  }

  // full held amount = rental + deposit - by Eman
  const totalHeld = Number(rentalAmount) + Number(securityDeposit);

  // trust the server for companies (take them from the booking, not the client) - by Eman
  const companyId = booking.companyId; // renter / payer
  const ownerCompanyId = booking.ownerCompanyId; // owner / beneficiary

  const escrowCode = await generateEscrowCode();

  const escrow = await escrowModel.create({
    escrowCode,
    bookingId,
    contractId,
    companyId,
    ownerCompanyId,
    rentalAmount: Number(rentalAmount),
    securityDeposit: Number(securityDeposit),
    totalHeld,
    currency: currency || "EGP",
    status: "Held",
    heldAt: new Date(),
  });

  return escrow;
};

// GET escrow by id - by Eman
const getEscrowById = async (id) => {
  if (!mongoose.isValidObjectId(id)) throw makeError("Invalid escrow id", 400);
  const escrow = await escrowModel
    .findById(id)
    .populate("bookingId")
    .populate("contractId")
    .populate("companyId", "companyName companyEmail")
    .populate("ownerCompanyId", "companyName companyEmail");
  if (!escrow) throw makeError("Escrow not found", 404);
  return escrow;
};

// GET escrow by contract id - by Eman
const getEscrowByContract = async (contractId) => {
  if (!mongoose.isValidObjectId(contractId))
    throw makeError("Invalid contractId", 400);
  const escrow = await escrowModel
    .findOne({ contractId })
    .populate("bookingId")
    .populate("contractId")
    .populate("companyId", "companyName companyEmail")
    .populate("ownerCompanyId", "companyName companyEmail");
  if (!escrow) throw makeError("No escrow found for this contract", 404);
  return escrow;
};

// GET escrow by booking id - by Eman
const getEscrowByBooking = async (bookingId) => {
  if (!mongoose.isValidObjectId(bookingId))
    throw makeError("Invalid bookingId", 400);
  const escrow = await escrowModel
    .findOne({ bookingId })
    .populate("bookingId")
    .populate("contractId")
    .populate("companyId", "companyName companyEmail")
    .populate("ownerCompanyId", "companyName companyEmail");
  if (!escrow) throw makeError("No escrow found for this booking", 404);
  return escrow;
};

// UPDATE escrow status (used later by Release/Dispute too) - by Eman
const updateEscrowStatus = async (id, newStatus) => {
  if (!mongoose.isValidObjectId(id)) throw makeError("Invalid escrow id", 400);
  if (!VALID_STATUSES.includes(newStatus)) {
    throw makeError(
      "Invalid status. Must be one of: Held, Frozen, Released, Refunded, Cancelled",
      400
    );
  }

  const escrow = await escrowModel.findById(id);
  if (!escrow) throw makeError("Escrow not found", 404);

  // BUSINESS RULE: a finalized escrow cannot change status - by Eman
  if (FINAL_STATUSES.includes(escrow.status)) {
    throw makeError(
      "Escrow is already finalized, status cannot be changed",
      400
    );
  }

  escrow.status = newStatus;
  await escrow.save();
  return escrow;
};

// FREEZE escrow money when a dispute is opened
const freezeMoney = async (escrowId) => {
  if (!mongoose.isValidObjectId(escrowId)) throw makeError("Invalid escrow id", 400);

  const escrow = await escrowModel.findById(escrowId);
  if (!escrow) throw makeError("Escrow not found", 404);

  // Idempotent — if already Frozen, just return current state
  if (escrow.status === "Frozen") {
    return escrow;
  }

  // Freeze escrow only if it's not finalized (handled by Eman's updateEscrowStatus)
  return await updateEscrowStatus(escrowId, "Frozen");
};

// RELEASE money to the owner company
const releaseMoney = async (bookingId) => {
  if (!mongoose.isValidObjectId(bookingId)) throw makeError("Invalid bookingId", 400);

  // Validate booking exists
  const booking = await bookingModel.findById(bookingId);
  if (!booking) throw makeError("Booking not found", 404);

  // Business Rule: Cannot release before contract is Completed
  if (booking.status !== "Completed") {
    throw makeError("Invalid operation. Cannot release money before booking is completed", 400);
  }

  // Business Rule: Cannot release money while an open dispute exists
  const openDispute = await disputeModel.findOne({ bookingId, status: "Open" });
  if (openDispute) {
    throw makeError("Invalid operation. Cannot release money while an open dispute exists", 400);
  }

  // Find escrow for this booking
  const escrow = await escrowModel.findOne({ bookingId });
  if (!escrow) throw makeError("Escrow not found for this booking", 404);

  // Transition to Released using Eman's method to obey all FINAL_STATUSES checks
  return await updateEscrowStatus(escrow._id, "Released");
};


// DEDUCT PENALTY from security deposit (Added for Penalty & Maintenance module)
const deductPenaltyFromDeposit = async (bookingId, penaltyAmount) => {
  if (!mongoose.isValidObjectId(bookingId)) throw makeError("Invalid bookingId", 400);
  
  if (penaltyAmount < 0) {
    throw makeError("Penalty amount cannot be negative", 400);
  }

  const escrow = await escrowModel.findOne({ bookingId });
  if (!escrow) throw makeError("Escrow not found for this booking", 404);

  // Business Rule: Penalty cannot exceed the available security deposit
  if (penaltyAmount > escrow.securityDeposit) {
    throw makeError("Penalty cannot exceed the available security deposit", 400);
  }

  // Deduct from deposit and totalHeld (keep rentalAmount untouched)
  escrow.securityDeposit -= penaltyAmount;
  escrow.totalHeld -= penaltyAmount;
  
  await escrow.save();
  return escrow;
};

module.exports = {
  createEscrow,
  getEscrowById,
  getEscrowByContract,
  getEscrowByBooking,
  updateEscrowStatus,
  freezeMoney,
  releaseMoney,

  deductPenaltyFromDeposit,

};
