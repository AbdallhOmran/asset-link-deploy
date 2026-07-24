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
const getDashboard = async (req, res) => {
    try {
        console.log("Dashboard API called");

        const dashboard = await paymentService.getDashboard();

        console.log("Dashboard Result:", dashboard);

        res.status(200).json({
            success: true,
            data: dashboard
        });

    } catch (err) {

        console.log("========== ERROR ==========");
        console.log(err);
        console.log(err.stack);

        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = {createPayment, getDashboard};
