const Payment = require("../models/payment.model");

const processPayment = async (paymentId) => {

    const payment = await Payment.findById(paymentId);

    if (!payment) {
        throw new Error("Payment not found");
    }

    if (payment.paymentStatus === "Completed") {
        throw new Error("Payment already completed");
    }

    payment.paymentStatus = "Completed";
    payment.paidAt = new Date();
    await payment.save();
    return payment;
};
module.exports = {processPayment};