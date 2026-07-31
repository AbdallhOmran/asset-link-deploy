const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");
const authMiddleware = require("../middleware/auth.middleware");
const requireIdempotency = require("../middlewares/idempotency.middleware");

router.post("/create", requireIdempotency, paymentController.createPayment);
router.post("/pay", requireIdempotency, paymentController.completePayment);
router.get("/dashboard", authMiddleware, paymentController.getDashboard);

module.exports = router;