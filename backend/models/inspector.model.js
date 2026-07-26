const mongoose = require('mongoose');

const inspectorSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Name is required"],
    trim: true
  },
  inspectorEmail: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    lowercase: true, 
    unique: true
  },
  phoneNumber: {
    type: String,
    required: [true, "Phone is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"], 
    trim: true,
  },
  role: {
    type: String,
    default: "Inspector"
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
},
{
  timestamps: true
});

module.exports = mongoose.model("inspector", inspectorSchema);