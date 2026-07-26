const escrowService = require("../services/escrow.service");

// POST /escrow - by Eman
const createEscrow = async (req, res) => {
  try {
    const escrow = await escrowService.createEscrow(req.body);
    return res.status(201).json({
      success: true,
      message: "Escrow created and amount held successfully",
      data: escrow,
    });
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({ success: false, message: err.message });
  }
};

// GET /escrow/:id - by Eman
const getEscrow = async (req, res) => {
  try {
    const escrow = await escrowService.getEscrowById(req.params.id);
    return res.status(200).json({ success: true, data: escrow });
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({ success: false, message: err.message });
  }
};

// GET /escrow/contract/:contractId - by Eman
const getEscrowByContract = async (req, res) => {
  try {
    const escrow = await escrowService.getEscrowByContract(
      req.params.contractId
    );
    return res.status(200).json({ success: true, data: escrow });
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({ success: false, message: err.message });
  }
};

// GET /escrow/booking/:bookingId - by Eman
const getEscrowByBooking = async (req, res) => {
  try {
    const escrow = await escrowService.getEscrowByBooking(req.params.bookingId);
    return res.status(200).json({ success: true, data: escrow });
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({ success: false, message: err.message });
  }
};

// PATCH /escrow/:id/status - by Eman
const updateEscrowStatus = async (req, res) => {
  try {
    const escrow = await escrowService.updateEscrowStatus(
      req.params.id,
      req.body.status
    );
    return res.status(200).json({
      success: true,
      message: "Escrow status updated successfully",
      data: escrow,
    });
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({ success: false, message: err.message });
  }
};

// PATCH /escrow/booking/:bookingId/release
const releaseMoney = async (req, res) => {
  try {
    const escrow = await escrowService.releaseMoney(req.params.bookingId);
    return res.status(200).json({
      success: true,
      message: "Escrow money released successfully",
      data: escrow,
    });
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({ success: false, message: err.message });
  }
};

module.exports = {
  createEscrow,
  getEscrow,
  getEscrowByContract,
  getEscrowByBooking,
  updateEscrowStatus,
  releaseMoney,
};