const mongoose = require('mongoose')

const negotiationSchema  = new mongoose.Schema({

  negotiationCode: {type:String, required:true, unique: true},

  ownerCompany: {type:mongoose.Schema.Types.ObjectId, ref: "company" ,required: true},

  renterCompany: {type: mongoose.Schema.Types.ObjectId, ref: "company", required: true},

  bookingId: {type: mongoose.Schema.Types.ObjectId, ref: "booking", required:true},

  currentVersion: {type: mongoose.Schema.Types.ObjectId, ref: "version"},
  status:{type:String, enum:["Approved", "Pending", "Rejected"], default:"Pending"},
  isActive: {type: Boolean, default:true},
},
{
  timestamps: true
}
);

module.exports = mongoose.model("negotiation", negotiationSchema);