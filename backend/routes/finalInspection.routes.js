const express = require("express");
const router = express.Router();
const finalInspectionController = require("../controllers/finalInspection.controller");

router.post("/", finalInspectionController.createFinalInspection);
router.get("/booking/:bookingId", finalInspectionController.getFinalInspectionByBooking);
router.get("/", finalInspectionController.getAllFinalInspections);

module.exports = router;