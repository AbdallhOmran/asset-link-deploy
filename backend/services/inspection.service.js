const Inspection = require("../models/inspection.model");
const Booking = require("../models/booking.model");

const ACTIVE_BOOKING_STATUSES = ["Pending", "Confirmed", "InNegotiation"];

const createInspection = async (data) => {
  const booking = await Booking.findById(data.bookingId);

  if (!booking) {
    throw new Error("Booking not found");
  }

  const existingInspection = await Inspection.findOne({
    bookingId: data.bookingId,
  });

  if (existingInspection) {
    throw new Error("Inspection already exists for this booking");
  }

  const inspection = await Inspection.create({
    bookingId: data.bookingId,
    assetId: data.assetId,
    inspectorName: data.inspectorName,
    photos: data.photos,
    notes: data.notes,
    checklist: data.checklist,
    conditionScore: data.conditionScore,
    status: data.status,
  });

  if (data.status === "Failed") {
    booking.status = "Cancelled";
    booking.cancelReason = "Inspection failed";
    await booking.save();
  }

  if (data.status === "Passed") {
    booking.status = "Confirmed";
    await booking.save();
  }

  return inspection;
};

const getAllInspections = async (filters = {}) => {
  const query = {};

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.assetId) {
    query.assetId = filters.assetId;
  }

  if (filters.bookingId) {
    query.bookingId = filters.bookingId;
  }

  const inspections = await Inspection.find(query)
    .populate("bookingId")
    .populate("assetId")
    .sort({ createdAt: -1 });

  return inspections;
};

const getInspectionById = async (id) => {
  const inspection = await Inspection.findById(id)
    .populate("bookingId")
    .populate("assetId");

  if (!inspection) {
    throw new Error("Inspection not found");
  }

  return inspection;
};

const getInspectionByBooking = async (bookingId) => {
  const inspection = await Inspection.findOne({ bookingId })
    .populate("bookingId")
    .populate("assetId");

  if (!inspection) {
    throw new Error("Inspection not found for this booking");
  }

  return inspection;
};

const getInspectionsByAsset = async (assetId) => {
  const inspections = await Inspection.find({ assetId })
    .populate("bookingId")
    .sort({ createdAt: -1 });

  return inspections;
};

const updateInspection = async (id, data) => {
  const inspection = await Inspection.findById(id);

  if (!inspection) {
    throw new Error("Inspection not found");
  }

  // Only allow updating notes, photos, checklist, conditionScore
  // Status change is a significant business action, only allow if explicitly provided
  if (data.notes !== undefined) {
    inspection.notes = data.notes;
  }

  if (data.photos !== undefined) {
    inspection.photos = data.photos;
  }

  if (data.checklist !== undefined) {
    inspection.checklist = {
      ...inspection.checklist,
      ...data.checklist,
    };
  }

  if (data.conditionScore !== undefined) {
    inspection.conditionScore = data.conditionScore;
  }

  if (data.inspectorName !== undefined) {
    inspection.inspectorName = data.inspectorName;
  }

  if (data.status !== undefined && data.status !== inspection.status) {
    if (!["Passed", "Failed"].includes(data.status)) {
      throw new Error("Invalid inspection status. Must be 'Passed' or 'Failed'");
    }

    inspection.status = data.status;

    // Update booking status accordingly
    const booking = await Booking.findById(inspection.bookingId);
    if (booking) {
      if (data.status === "Failed") {
        booking.status = "Cancelled";
        booking.cancelReason = "Inspection failed";
        await booking.save();
      } else if (data.status === "Passed") {
        booking.status = "Confirmed";
        await booking.save();
      }
    }
  }

  await inspection.save();
  return inspection;
};

const deleteInspection = async (id) => {
  const inspection = await Inspection.findById(id);

  if (!inspection) {
    throw new Error("Inspection not found");
  }

  // Business rule: prevent deleting inspection linked to an active booking
  const booking = await Booking.findById(inspection.bookingId);
  if (booking && ACTIVE_BOOKING_STATUSES.includes(booking.status)) {
    throw new Error(
      `Cannot delete inspection linked to an active booking (status: ${booking.status}). ` +
      `Cancel or complete the booking first.`
    );
  }

  await inspection.deleteOne();

  return {
    success: true,
    message: "Inspection deleted successfully",
  };
};

module.exports = {
  createInspection,
  getAllInspections,
  getInspectionById,
  getInspectionByBooking,
  getInspectionsByAsset,
  updateInspection,
  deleteInspection,
};