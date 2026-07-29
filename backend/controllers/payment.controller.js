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

const completePayment = async (req, res) => {
    try {
        const { bookingId } = req.body;
        const result = await paymentService.completePayment(bookingId);

        res.status(200).json({
            success: true,
            message: "Payment completed successfully",
            data: result
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getDashboard = async (req, res) => {
    try {
        console.log(req.user);
        const dashboard = await paymentService.getDashboard(req.user.id);

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

module.exports = { 
    createPayment, 
    completePayment, 
    getDashboard 
};
