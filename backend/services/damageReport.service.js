const DamageReport = require("../models/damageReport.model");
const Booking = require("../models/booking.model");

const createDamageReport = async (data) => {
  const { inspection, booking, damageCost, damageLevel, description } = data;

  const damageReport = await DamageReport.create({
    inspection,
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
    .populate("inspection")
    .populate("booking");
};

const getAllDamageReports = async () => {
  return await DamageReport.find()
    .populate("booking")
    .populate("inspection");
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