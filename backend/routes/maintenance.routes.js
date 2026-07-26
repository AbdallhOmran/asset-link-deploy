const express = require("express");
const router = express.Router();

const {
  createMaintenance,
  getMaintenance,
  updateMaintenance,
  updateStatus,
  getMaintenanceHistory,
  deleteMaintenance,
} = require("../controllers/maintenance.controller");

router.post("/", createMaintenance);

router.get("/history", getMaintenanceHistory);

router.get("/:id", getMaintenance);

router.put("/:id", updateMaintenance);

router.patch("/:id/status", updateStatus);

router.delete("/:id", deleteMaintenance);

module.exports = router;
