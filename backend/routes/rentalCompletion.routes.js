const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");

const {
  returnAsset,
  completeRental
} = require("../controllers/rentalCompletion.controller");

// Both actions are tied to a specific booking ID
router.patch("/:bookingId/return", authMiddleware, returnAsset);
router.patch("/:bookingId/complete", authMiddleware, completeRental);

module.exports = router;
