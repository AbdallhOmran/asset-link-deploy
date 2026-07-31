const mongoose = require("mongoose");

const idempotencySchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  responseBody: {
    type: mongoose.Schema.Types.Mixed, // Can store JSON or string
    required: true
  },
  statusCode: {
    type: Number,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // Automatically delete after 24 hours
  }
});

module.exports = mongoose.model("IdempotencyKey", idempotencySchema);
