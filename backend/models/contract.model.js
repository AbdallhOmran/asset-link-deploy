const mongoose = require("mongoose");

const contractSchema = new mongoose.Schema(
  {
    contractCode: {
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

    assetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "asset",
      required: true,
    },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "company",
      required: true,
    },

    ownerCompanyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "company",
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    securityDeposit: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["Draft", "Active", "Rejected", "Completed"],
      default: "Draft",
    },

    approvedAt: {
      type: Date,
      default: null,
    },

    rejectedAt: {
      type: Date,
      default: null,
    },

    pdfPath: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("contract", contractSchema);


