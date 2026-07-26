const mongoose = require("mongoose");

const finalInspectionSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "booking", // fixed: was "Booking" (capital)
      required: true,
    },
    beforeInspection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "inspection",
      required: true,
    },
    inspector: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "inspector", // fixed: was "User"
      required: true,
    },
    afterPhotos: [
      {
        type: String,
        required: true,
      },
    ],
    conditionScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    damageLevel: {
      type: String,
      enum: ["none", "minor", "moderate", "severe"],
      default: "none",
    },
    damageCost: {
      type: Number,
      default: 0,
    },
    hasDamage: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("finalInspection", finalInspectionSchema); // fixed: was "FinalInspection"