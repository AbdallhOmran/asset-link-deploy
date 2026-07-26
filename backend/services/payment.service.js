const Payment = require("../models/payment.model");
const Booking = require("../models/booking.model");
const Contract = require("../models/contract.model"); 

const createPayment = async (bookingId) => {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
        throw new Error("Booking not found");
    }
    if (booking.status !== "Confirmed") {
        throw new Error("Booking is not confirmed");
    }
    const existingPayment = await Payment.findOne({ bookingId });
    
    if (existingPayment) {
        throw new Error("Booking already paid");
    }

    const contractData = await Contract.findOne({ bookingId });
    if (!contractData) {
        throw new Error("Contract not found for this booking");
    }

    const totalToPay = contractData.totalPrice + contractData.securityDeposit;

    const payment = await Payment.create({
        bookingId: booking._id,
        companyId: booking.companyId,
        amount: totalToPay,
        paymentStatus: "Pending",
    });
    
    return payment;
}

module.exports = { createPayment };
