const paymentService = require("../services/payment.service");

const createPayment = async (req, res) => {
    try {
        const { bookingId } = req.body;
        const payment = await paymentService.createPayment(bookingId);
        
        res.status(201).json({
            success: true,
            message: "Payment created successfully",
            data: payment
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = { createPayment };
