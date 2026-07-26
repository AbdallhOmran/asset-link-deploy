const mongoose = require("mongoose");

// Escrow schema - holds rental amount + security deposit after contract approval - by Eman
const escrowSchema = new mongoose.Schema(
{
    escrowCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    },

    // link to the booking - by Eman
    bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "booking",
    required: true,
    },

    // link to the contract (deposit is tied to the contract) - by Eman
    contractId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "contract",
    required: true,
    },

    // the renting company (the payer whose money is held) - by Eman
    companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "company",
    required: true,
    },

    // the owner company (the beneficiary who will receive the money) - by Eman
    ownerCompanyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "company",
    required: true,
    },

    // Hold Rental Amount - by Eman
    rentalAmount: {
    type: Number,
    required: [true, "Rental amount is required"],
    min: 0,
    },

    // Hold Security Deposit - by Eman
    securityDeposit: {
    type: Number,
    required: [true, "Security deposit is required"],
    min: 0,
    },

    // full held amount = rental + deposit (held in full) - by Eman
    totalHeld: {
    type: Number,
    required: true,
    min: 0,
    },

    currency: {
    type: String,
    trim: true,
    default: "EGP",
    },

    // Escrow Status - by Eman
    status: {
    type: String,
    enum: ["Held", "Frozen", "Released", "Refunded", "Cancelled"],
    default: "Held",
    },

    // when the money was held - by Eman
    heldAt: {
    type: Date,
    default: Date.now,
    },
},
{
    timestamps: true,
}
);

module.exports = mongoose.model("escrow", escrowSchema);