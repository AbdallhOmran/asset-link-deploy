const mongoose = require("mongoose");

const penaltySchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "booking",
      required: true,
    },
    assetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "asset",
      required: true,
    },
    damageCost: {
      type: Number,
      required: true,
      min: 0,
    },
    penaltyAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["Pending", "Applied"],
      default: "Applied",
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("penalty", penaltySchema);
