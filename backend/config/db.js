// const mongoose = require("mongoose");
// require("dotenv").config();

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MYCONNECTION);
//     console.log("Connected to database");
//   } catch (err) {
//     console.error(err);
//   }
// };

// module.exports = connectDB;


const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  console.log("========== DB ==========");
  console.log("MYCONNECTION exists:", !!process.env.MYCONNECTION);
  console.log("MYCONNECTION:", process.env.MYCONNECTION?.slice(0, 40));

  try {
    await mongoose.connect(process.env.MYCONNECTION);

    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ Mongo Error:");
    console.error(err);
    throw err;
  }
};

module.exports = connectDB;