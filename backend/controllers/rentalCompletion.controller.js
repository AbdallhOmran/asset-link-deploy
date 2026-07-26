const rentalCompletionService = require("../services/rentalCompletion.service");

// PATCH /booking/:bookingId/return
const returnAsset = async (req, res) => {
  try {
    const booking = await rentalCompletionService.returnAsset(req.params.bookingId);
    return res.status(200).json({
      success: true,
      message: "Asset returned successfully",
      data: booking,
    });
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({ success: false, message: err.message });
  }
};

// PATCH /booking/:bookingId/complete
const completeRental = async (req, res) => {
  try {
    const result = await rentalCompletionService.completeRental(req.params.bookingId);
    return res.status(200).json({
      success: true,
      message: "Rental completed and contract closed successfully",
      data: result,
    });
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({ success: false, message: err.message });
  }
};

module.exports = {
  returnAsset,
  completeRental
};
