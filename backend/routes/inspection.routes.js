const express = require("express");
const router = express.Router();
const inspectionController = require("../controllers/inspection.controller");
const authMiddleware = require("../middleware/auth.middleware");

// NOTE: Auth middleware intentionally omitted for now (Known gap – security debt).
// Will be added during production hardening. See Integration meeting notes.

// List all inspections (supports ?status=Passed&assetId=xxx&bookingId=xxx)
router.get("/",authMiddleware,inspectionController.getAllInspections);

// Get inspection by booking ID
router.get("/booking/:bookingId", inspectionController.getInspectionByBooking);

// Get all inspections for a specific asset (history)
router.get("/asset/:assetId", inspectionController.getInspectionsByAsset);

// Get single inspection by ID
router.get("/:id", inspectionController.getInspectionById);

// Create new inspection
router.post("/create", inspectionController.createInspection);

// Update inspection
router.put("/:id", inspectionController.updateInspection);

// Delete inspection
router.delete("/:id", inspectionController.deleteInspection);

module.exports = router;