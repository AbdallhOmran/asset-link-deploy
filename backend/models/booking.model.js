const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({

  bookingCode: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  assetId: { type: mongoose.Schema.Types.ObjectId, ref: "asset", required: true },

  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "company", required: true },

  ownerCompanyId: { type: mongoose.Schema.Types.ObjectId, ref: "company", required: true },

  assignedInspectorId:{type: mongoose.Schema.Types.ObjectId, ref: "inspector"},

  startDate: {
    type: Date,
    required: [true, "Start date is required"]
  },

  endDate: {
    type: Date,
    required: [true, "End date is required"]
  },

  priceType: {
    type: String,
    enum: ["Daily", "Weekly", "Monthly"],
    required: [true, "Price type is required"]
  },

  totalPrice: {
    type: Number,
    required: [true, "Total price is required"]
  },

  status: {
    type: String,
    enum: ["Pending", "InNegotiation", "Confirmed", "Rejected", "Cancelled", "Completed"],
    default: "Pending"
  },

  cancelReason: {
    type: String,
    trim: true
  },

  returnedAt: {
    type: Date
  },

  notes: {
    type: String,
    trim: true
  }

},
{
  timestamps: true
});

module.exports = mongoose.model("booking", bookingSchema);
