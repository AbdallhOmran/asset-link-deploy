const mongoose = require("mongoose");

const disputeSchema = new mongoose.Schema({

  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "booking", required: true },

  raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: "company", required: true },

  reason: {
    type: String,
    required: [true, "Dispute reason is required"],
    trim: true
  },

  status: {
    type: String,
    enum: ["Open", "Resolved"],
    default: "Open"
  },

  resolution: {
    type: String,
    enum: ["ReleaseMoney", "Refund"]
  },

  resolutionNotes: {
    type: String,
    trim: true
  }

},
{
  timestamps: true
});

module.exports = mongoose.model("dispute", disputeSchema);
