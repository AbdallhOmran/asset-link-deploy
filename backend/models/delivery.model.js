const mongoose = require("mongoose");
//model for delivery
const deliverySchema = new mongoose.Schema(
  {
    deliveryCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "booking",
      required: true,
    },

    contractId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "contract",
      required: true,
    },

    pickupLocation: {
      type: String,
      required: true,
      trim: true,
    },

    deliveryLocation: {
      type: String,
      required: true,
      trim: true,
    },

    driverName: {
      type: String,
      required: true,
      trim: true,
    },

    driverPhone: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Preparing", "Picked Up", "In Transit", "Delivered"],
      default: "Preparing",
    },

    statusHistory: [
      {
        status: {
          type: String,
          enum: ["Preparing", "Picked Up", "In Transit", "Delivered"],
        },

        changedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    estimatedArrival: {
      type: Date,
      required: true,
    },

    actualArrival: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("delivery", deliverySchema);
