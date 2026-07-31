require('dotenv').config();
const mongoose = require('mongoose');
const Booking = require('./models/booking.model');
const Asset = require('./models/asset.model');

async function fixAsset() {
  try {
    await mongoose.connect(process.env.MYCONNECTION);
    console.log('Connected to DB');
    
    // Find BK-000003
    const booking = await Booking.findOne({ bookingCode: 'BK-000003' });
    if (booking) {
      console.log('Found booking:', booking._id, 'Asset:', booking.assetId);
      const updatedAsset = await Asset.findByIdAndUpdate(booking.assetId, { status: 'Available' }, { new: true });
      console.log('Updated asset status:', updatedAsset?.status);
    } else {
      console.log('Booking BK-000003 not found.');
    }
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

fixAsset();
