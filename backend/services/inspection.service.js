const Inspection = require("../models/inspection.model");
const Booking = require("../models/booking.model");
const Asset = require("../models/asset.model");
const Company = require("../models/company.model");

const ACTIVE_BOOKING_STATUSES = ["Pending", "Confirmed", "InNegotiation"];

const createInspection = async (data) => {
  const booking = await Booking.findById(data.bookingId);

  if (!booking) {
    throw new Error("Booking not found");
  }

  // Prevent duplicate inspection of the same type
  const existingInspection = await Inspection.findOne({
    bookingId: data.bookingId,
    inspectionType: data.inspectionType || "before_use",
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
    inspectionType: data.inspectionType || "before_use",
    damageLevel: data.damageLevel || "none",
    damageCost: data.damageCost || 0,
    hasDamage: data.hasDamage || false,
  });

  // ==========================================
  // BEFORE RENTAL INSPECTION
  // ==========================================
  if (inspection.inspectionType === "before_use") {

    if (inspection.status === "Passed") {

      booking.status = "Confirmed";
      booking.cancelReason = "";

      await booking.save();
      
await Asset.findByIdAndUpdate(
    inspection.assetId,
    {
        status: "Booked",
        healthScore: inspection.conditionScore,
    }
);

    } else {

      booking.status = "Cancelled";
      booking.cancelReason = "Inspection failed";

      await booking.save();

      await Asset.findByIdAndUpdate(inspection.assetId, {
        status: "Available",
      });

    }

  }

  // ==========================================
  // AFTER RENTAL INSPECTION
  // ==========================================
  else {

    booking.status = "Completed";
    await booking.save();

    if (inspection.hasDamage) {

      await Asset.findByIdAndUpdate(inspection.assetId, {
        status: "Maintenance",
      });

    } else {

      await Asset.findByIdAndUpdate(inspection.assetId, {
        status: "Available",
      });

    }

  }

  return inspection;
};
const getAllInspections = async (filters = {}, user) => {

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

  if (filters.inspectionType) {
    query.inspectionType = filters.inspectionType;
  }

  // ===============================
  // Filter inspections by company
  // ===============================

  if (user) {

    const company = await Company.findById(user.id);

    if (!company) {
      throw new Error("Company not found");
    }

    let bookingQuery = {};

    switch (company.companyType) {

      case "Owner":
        bookingQuery.ownerCompanyId = company._id;
        break;

      case "Renter":
        bookingQuery.companyId = company._id;
        break;

      case "Both":
        bookingQuery.$or = [
          { ownerCompanyId: company._id },
          { companyId: company._id },
        ];
        break;

      default:
        bookingQuery.companyId = company._id;
    }

    const bookings = await Booking.find(
      bookingQuery,
      "_id"
    );

    query.bookingId = {
      $in: bookings.map((b) => b._id),
    };
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

const getInspectionByBooking = async (bookingId, inspectionType = 'before_use') => {
  const inspection = await Inspection.findOne({ bookingId, inspectionType })
    .populate("bookingId")
    .populate("assetId");

  if (!inspection) {
    throw new Error(`Inspection not found for this booking (type: ${inspectionType})`);
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

  if (data.inspectionType !== undefined) {
    inspection.inspectionType = data.inspectionType;
  }

  if (data.damageLevel !== undefined) {
    inspection.damageLevel = data.damageLevel;
  }

  if (data.damageCost !== undefined) {
    inspection.damageCost = data.damageCost;
  }

  if (data.hasDamage !== undefined) {
    inspection.hasDamage = data.hasDamage;
  }

  if (data.status !== undefined) {
    if (!["Passed", "Failed"].includes(data.status)) {
      throw new Error("Invalid inspection status. Must be 'Passed' or 'Failed'");
    }

    inspection.status = data.status;

    const booking = await Booking.findById(inspection.bookingId);

    if (booking) {

      // ==========================================
      // BEFORE RENTAL INSPECTION
      // ==========================================
      if (inspection.inspectionType === "before_use") {

        if (inspection.status === "Passed") {

          booking.status = "Confirmed";
          booking.cancelReason = "";

          await booking.save();

          await Asset.findByIdAndUpdate(
            inspection.assetId,
            {
              status: "Booked",
              healthScore: inspection.conditionScore,
            }
          );

        } else {

          booking.status = "Cancelled";
          booking.cancelReason = "Inspection failed";

          await booking.save();

          await Asset.findByIdAndUpdate(
            inspection.assetId,
            {
              status: "Available",
              healthScore: inspection.conditionScore,
            }
          );

        }

      }

      // ==========================================
      // AFTER RENTAL INSPECTION
      // ==========================================
      else {

        booking.status = "Completed";
        await booking.save();

        if (inspection.hasDamage) {

          await Asset.findByIdAndUpdate(
            inspection.assetId,
            {
              status: "Maintenance",
              healthScore: inspection.conditionScore,
            }
          );

        } else {

          await Asset.findByIdAndUpdate(
            inspection.assetId,
            {
              status: "Available",
              healthScore: inspection.conditionScore,
            }
          );

        }

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