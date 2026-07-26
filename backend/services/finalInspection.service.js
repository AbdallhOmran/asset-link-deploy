const FinalInspection = require("../models/finalInspection.model");
const Booking = require("../models/booking.model");
const damageReportService = require("./damageReport.service");

const createFinalInspection = async (data) => {
  const {
    booking,
    beforeInspection,
    inspector,
    afterPhotos,
    conditionScore,
    notes,
  } = data;

  const damageCost = calculateDamageCost(conditionScore);
  const damageLevel = getDamageLevel(conditionScore);
  const hasDamage = damageLevel !== "none";

  const finalInspection = await FinalInspection.create({
    booking,
    beforeInspection,
    inspector,
    afterPhotos,
    conditionScore,
    damageCost,
    damageLevel,
    hasDamage,
    notes,
    status: "completed",
  });

  if (hasDamage) {
    await damageReportService.createDamageReport({
      finalInspection: finalInspection._id,
      booking,
      damageCost,
      damageLevel,
      description: notes,
    });
  } else {
    // fixed: "ready_to_close" wasn't a valid enum value in booking.model.js
    // booking.model.js enum: ["Pending", "InNegotiation", "Confirmed", "Rejected", "Cancelled", "Completed"]
    await Booking.findByIdAndUpdate(booking, {
      status: "Completed",
    });
  }

  return finalInspection;
};

const calculateDamageCost = (conditionScore) => {
  if (conditionScore >= 90) return 0;
  if (conditionScore >= 70) return 200; // minor
  if (conditionScore >= 40) return 800; // moderate
  return 2000; // severe
};

const getDamageLevel = (conditionScore) => {
  if (conditionScore >= 90) return "none";
  if (conditionScore >= 70) return "minor";
  if (conditionScore >= 40) return "moderate";
  return "severe";
};

const getFinalInspectionByBooking = async (bookingId) => {
  return await FinalInspection.findOne({ booking: bookingId })
    .populate("beforeInspection")
    .populate("inspector", "fullName inspectorEmail");
};

const getAllFinalInspections = async () => {
  return await FinalInspection.find().populate("booking");
};

module.exports = {
  createFinalInspection,
  getFinalInspectionByBooking,
  getAllFinalInspections,
};