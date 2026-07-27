const mongoose = require("mongoose");
const bookingModel = require("../models/booking.model");
const assetModel = require("../models/asset.model");
const companyModel = require("../models/company.model");
const disputeModel = require("../models/dispute.model");
const generateBookingCode = require("../utils/generateBookingCode");

const VALID_PRICE_TYPES = ["Daily", "Weekly", "Monthly"];
const VALID_STATUSES = ["Pending", "Confirmed", "Rejected", "Cancelled", "Completed"];

const createBooking = async (bookingData) => {
  const {
    assetId,
    companyId,
    ownerCompanyId,
    startDate,
    endDate,
    priceType,
    totalPrice,
    notes
  } = bookingData;

  // Validation — required fields
  if (!assetId) throw new Error("assetId is required");
  if (!companyId) throw new Error("companyId is required");
  if (!ownerCompanyId) throw new Error("ownerCompanyId is required");
  if (!startDate) throw new Error("startDate is required");
  if (!endDate) throw new Error("endDate is required");
  if (!priceType) throw new Error("priceType is required");
  if (totalPrice === undefined || totalPrice === null)
    throw new Error("totalPrice is required");

  // Validation — priceType enum
  if (!VALID_PRICE_TYPES.includes(priceType)) {
    throw new Error(
      "Invalid priceType. Must be one of: Daily, Weekly, Monthly"
    );
  }

  // Validation — DB lookups
  const checkAsset = await assetModel.findById(assetId);
  if (!checkAsset) throw new Error("Asset not found");

  const checkCompany = await companyModel.findById(companyId);
  if (!checkCompany) throw new Error("Company not found");

  // ===========================
  // NEW: Booking Dates Validation
  // ===========================

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start >= end) {
    throw new Error("Start date must be before end date");
  }

  const existingBooking = await bookingModel.findOne({
    assetId: assetId,
    status: {
      $in: ["Pending", "Confirmed"]
    },
    startDate: {
      $lt: end
    },
    endDate: {
      $gt: start
    }
  });

  if (existingBooking) {
    throw new Error("Asset is already booked for the selected dates");
  }

  // ===========================
  // End of Person 2 Logic
  // ===========================

  // Generate booking code
  const bookingCode = await generateBookingCode();

  // Start transaction session
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Create and save booking inside transaction
    const newBooking = new bookingModel({
      bookingCode,
      assetId,
      companyId,
      ownerCompanyId,
      startDate,
      endDate,
      priceType,
      totalPrice,
      notes
    });

    await newBooking.save({ session });

    // Update asset status to Booked inside the same transaction
    const updatedAsset = await assetModel.findByIdAndUpdate(
      assetId,
      { status: "Booked" },
      { new: true, runValidators: true, session }
    );

    if (!updatedAsset) {
      throw new Error("Failed to update asset status");
    }

    // Both operations succeeded — commit
    await session.commitTransaction();

    return newBooking;
  } catch (err) {
    // Any failure — rollback all database changes
    await session.abortTransaction();
    throw err;
  } finally {
    // Always close the session
    session.endSession();
  }
};

const getBookingById = async (id) => {
  const booking = await bookingModel.findById(id)
    .populate("assetId")
    .populate("companyId")
    .populate("ownerCompanyId");

  if (!booking) throw new Error("Booking not found");

  return booking;
};

const updateBookingStatus = async (id, statusData) => {
  const { status, cancelReason } = statusData;

  const booking = await bookingModel.findById(id);
  if (!booking) throw new Error("Booking not found");

  // Validation — status enum
  if (!VALID_STATUSES.includes(status)) {
    throw new Error(
      "Invalid status. Must be one of: Pending, Confirmed, Rejected, Cancelled, Completed"
    );
  }

  // If Completed, block transition if an open dispute exists
  if (status === "Completed") {
    const openDispute = await disputeModel.findOne({ bookingId: id, status: "Open" });
    if (openDispute) {
      throw new Error("Invalid status transition. Cannot complete booking while an open dispute exists");
    }
  }

  // If Cancelled, cancelReason is required
  if (status === "Cancelled" && !cancelReason) {
    throw new Error("cancelReason is required when status is Cancelled");
  }

  if (status === "Cancelled") {
    await assetModel.findByIdAndUpdate(booking.assetId, {
      status: "Available",
    });
  }

  booking.status = status;

  if (status === "Cancelled") {
    booking.cancelReason = cancelReason;
  }

  await booking.save();

  return booking;
};

// ====== Booking history & cancellation - Modified by Eman ======

// Company bookings: bookings on MY assets (I am the owner) - by Eman
const getCompanyBookings = async (companyId) => {
  const bookings = await bookingModel
    .find({ ownerCompanyId: companyId })
    .populate("assetId", "assetName assetCode assetImages status")
    .populate("companyId", "companyName companyEmail")
    .sort({ createdAt: -1 });
  return bookings;
};

// My bookings: bookings MY company made (I am the renter) - by Eman
const getMyBookings = async (companyId) => {
  const bookings = await bookingModel
    .find({ companyId })
    .populate("assetId", "assetName assetCode assetImages status")
    .populate("ownerCompanyId", "companyName companyEmail")
    .sort({ createdAt: -1 });
  return bookings;
};

// Cancel a booking (only the renter or the owner can cancel) - by Eman
const cancelBooking = async (id, cancelReason, userId) => {
  if (!mongoose.isValidObjectId(id)) {
    const e = new Error("Invalid booking id");
    e.statusCode = 400;
    throw e;
  }

  if (!cancelReason || !cancelReason.trim()) {
    const e = new Error("Cancel reason is required");
    e.statusCode = 400;
    throw e;
  }

  const booking = await bookingModel.findById(id);
  if (!booking) {
    const e = new Error("Booking not found");
    e.statusCode = 404;
    throw e;
  }

  // only the renter (companyId) or the owner (ownerCompanyId) can cancel - by Eman
  const isRenter = booking.companyId.toString() === userId;
  const isOwner = booking.ownerCompanyId.toString() === userId;
  if (!isRenter && !isOwner) {
    const e = new Error("Not allowed to cancel this booking");
    e.statusCode = 403;
    throw e;
  }

  if (booking.status === "Cancelled") {
    const e = new Error("Booking is already cancelled");
    e.statusCode = 400;
    throw e;
  }
  if (booking.status === "Completed") {
    const e = new Error("Cannot cancel a completed booking");
    e.statusCode = 400;
    throw e;
  }
  if (new Date(booking.startDate) < new Date()) {
    const e = new Error("Cannot cancel a booking that has already started");
    e.statusCode = 400;
    throw e;
  }

  // use a transaction so booking + asset update are atomic (same pattern as createBooking) - by Eman
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    booking.status = "Cancelled";
    booking.cancelReason = cancelReason.trim();
    await booking.save({ session });

    // return the asset to Available after cancellation - by Eman
    await assetModel.findByIdAndUpdate(
      booking.assetId,
      { status: "Available" },
      { new: true, session }
    );

    await session.commitTransaction();
    return booking;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

module.exports = {
  createBooking,
  getBookingById,
  updateBookingStatus,
  getCompanyBookings, // Added by Eman
  getMyBookings,      // Added by Eman
  cancelBooking,      // Added by Eman
};