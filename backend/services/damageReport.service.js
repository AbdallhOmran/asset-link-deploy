const DamageReport = require("../models/damageReport.model");
const Booking = require("../models/booking.model");

const createDamageReport = async (data) => {
  const { finalInspection, booking, damageCost, damageLevel, description } = data;

  const damageReport = await DamageReport.create({
    finalInspection,
    booking,
    damageCost,
    damageLevel,
    description,
    status: "pending",
  });

  // fixed: "pending_damage_resolution" wasn't a valid enum value in booking.model.js
  // booking.model.js enum: ["Pending", "InNegotiation", "Confirmed", "Rejected", "Cancelled", "Completed"]
  // keeping booking status as "Confirmed" until damage is resolved
  // (Person 4: Penalty/Maintenance flow will update it further once resolved)
  await Booking.findByIdAndUpdate(booking, {
    status: "Confirmed",
  });

  return damageReport;
};

const getDamageReportByBooking = async (bookingId) => {
  return await DamageReport.findOne({ booking: bookingId })
    .populate("finalInspection")
    .populate("booking");
};

const getAllDamageReports = async () => {
  return await DamageReport.find()
    .populate("booking")
    .populate("finalInspection");
};

const updateDamageReportStatus = async (id, status) => {
  return await DamageReport.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );
};

module.exports = {
  createDamageReport,
  getDamageReportByBooking,
  getAllDamageReports,
  updateDamageReportStatus,
};