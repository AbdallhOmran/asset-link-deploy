const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/create", paymentController.createPayment);
router.post("/pay", paymentController.completePayment);
router.get("/dashboard", authMiddleware, paymentController.getDashboard);

module.exports = router;