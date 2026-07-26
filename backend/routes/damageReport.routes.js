const express = require("express");
const router = express.Router();
const damageReportController = require("../controllers/damageReport.controller");

router.get("/booking/:bookingId", damageReportController.getDamageReportByBooking);
router.get("/", damageReportController.getAllDamageReports);
router.patch("/:id/status", damageReportController.updateDamageReportStatus);

module.exports = router;