const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");

router.post("/create", paymentController.createPayment);
router.post("/pay", paymentController.completePayment);
router.get("/dashboard", paymentController.getDashboard);

module.exports = router;