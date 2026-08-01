const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MYCONNECTION);
    console.log("Connected to database");
  } catch (err) {
    console.error(err);
  }
};

module.exports = connectDB;