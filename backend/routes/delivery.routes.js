const express = require("express");
const router = express.Router();

const {
  createDelivery,
  getDelivery,
  updateDeliveryStatus,
  getDeliveryTimeline,
  getDeliveryHistory,
} = require("../controllers/delivery.controller");

//middlewares
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

router.post("/", authMiddleware, roleMiddleware("Company", "Admin"), createDelivery);

router.get("/history", authMiddleware, getDeliveryHistory);

router.get("/:id", authMiddleware, getDelivery);

router.patch("/:id/status", authMiddleware, roleMiddleware("Company", "Admin"), updateDeliveryStatus);

router.get("/:id/timeline", authMiddleware, getDeliveryTimeline);

module.exports = router;