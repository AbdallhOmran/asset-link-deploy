const Payment = require("../models/payment.model");
const Booking = require("../models/booking.model");
const Contract = require("../models/contract.model"); 
const Escrow = require("../models/escrow.model");

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

const getDashboard = async () => {

    // ===========================
    // Summary Cards
    // ===========================

    const payments = await Payment.find();
    const escrows = await Escrow.find();

    const totalProcessed = payments
        .filter(p => p.paymentStatus === "Completed")
        .reduce((sum, p) => sum + p.amount, 0);

    const currentlyInEscrow = escrows
        .filter(e => e.status === "Held" || e.status === "Frozen")
        .reduce((sum, e) => sum + e.totalHeld, 0);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const releasedMTD = escrows
        .filter(e =>
            e.status === "Released" &&
            e.updatedAt.getMonth() === currentMonth &&
            e.updatedAt.getFullYear() === currentYear
        )
        .reduce((sum, e) => sum + e.totalHeld, 0);

    // Platform Fee = 5%
    const platformFee = releasedMTD * 0.05;

    // ===========================
    // Ledger
    // ===========================

    const ledger = await Escrow.find()
        .populate("companyId", "companyName")
        .populate("ownerCompanyId", "companyName")
        .populate("bookingId")
        .sort({ createdAt: -1 });

    const ledgerData = ledger.map(item => ({

        escrowId: item.escrowCode,

        booking:
            item.bookingId?.bookingCode ||
            item.bookingId?._id?.toString().slice(-6) ||
            "-",

        from:
            item.companyId?.companyName || "-",

        to:
            item.ownerCompanyId?.companyName || "-",

        total: item.totalHeld,

        held:
            item.status === "Held" || item.status === "Frozen"
                ? item.totalHeld
                : 0,

        released:
            item.status === "Released"
                ? item.totalHeld
                : 0,

        date: item.createdAt,

        status: item.status

    }));

    return {

        summary: {

            totalProcessed,

            currentlyInEscrow,

            releasedMTD,

            platformFee

        },

        ledger: ledgerData

    };

};



module.exports = { createPayment, getDashboard };
