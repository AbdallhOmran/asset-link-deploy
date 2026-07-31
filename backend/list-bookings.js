require('dotenv').config();
const mongoose = require('mongoose');
const Booking = require('./models/booking.model');
async function run() {
  await mongoose.connect(process.env.MYCONNECTION);
  const bookings = await Booking.find({});
  console.log(bookings.map(b => b.bookingId));
  process.exit(0);
}
run();
