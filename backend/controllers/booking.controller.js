const bookingService = require("../services/booking.service");

const createBooking = async (req, res) => {
  try {
    const newBooking = await bookingService.createBooking(req.body);
    return res.status(201).send(newBooking);
  } catch (err) {
    if (err.message.includes("not found")) {
      return res.status(404).send({ error: err.message });
    }
    if (err.message.includes("required") || err.message.includes("Invalid")) {
      return res.status(400).send({ error: err.message });
    }
    return res.status(500).send({ error: err.message });
  }
};

const getBooking = async (req, res) => {
  try {
    const booking = await bookingService.getBookingById(req.params.id);
    return res.status(200).send(booking);
  } catch (err) {
    if (err.message.includes("not found")) {
      return res.status(404).send({ error: err.message });
    }
    return res.status(500).send({ error: err.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const booking = await bookingService.updateBookingStatus(req.params.id, req.body);
    return res.status(200).send(booking);
  } catch (err) {
    if (err.message.includes("not found")) {
      return res.status(404).send({ error: err.message });
    }
    if (err.message.includes("required") || err.message.includes("Invalid")) {
      return res.status(400).send({ error: err.message });
    }
    return res.status(500).send({ error: err.message });
  }
};

// ====== Booking history & cancellation - Added by Eman ======

// GET /bookings/company -> bookings on my assets (I am the owner) - by Eman
const getCompanyBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getCompanyBookings(req.user.id);
    return res.status(200).send({ count: bookings.length, bookings });
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).send({ error: err.message });
  }
};

// GET /bookings/my -> bookings my company made (I am the renter) - by Eman
const getMyBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getMyBookings(req.user.id);
    return res.status(200).send({ count: bookings.length, bookings });
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).send({ error: err.message });
  }
};

// PATCH /bookings/:id/cancel - by Eman
const cancelBooking = async (req, res) => {
  try {
    const booking = await bookingService.cancelBooking(
      req.params.id,
      req.body.cancelReason,
      req.user.id
    );
    return res.status(200).send({ message: "Booking cancelled successfully", booking });
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).send({ error: err.message });
  }
};

module.exports = {
  createBooking,
  getBooking,
  updateStatus,
  getCompanyBookings, // Added by Eman
  getMyBookings,      // Added by Eman
  cancelBooking,      // Added by Eman
};