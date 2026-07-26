const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema(
  {
    maintenanceCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    assetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "asset",
      required: true,
    },

    issueDescription: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Scheduled", "In Progress", "Completed", "Cancelled"],
      default: "Pending",
    },

    maintenanceCost: {
      type: Number,
      default: 0,
    },

    maintenanceDate: {
      type: Date,
      default: Date.now,
    },

    completedDate: {
      type: Date,
      default: null,
    },

    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("maintenance", maintenanceSchema);
