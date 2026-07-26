const mongoose = require('mongoose')

const versionSchema = new mongoose.Schema({

  versionNumber: {type:Number, required:true},
  negotiationId: {type: mongoose.Schema.Types.ObjectId, ref: "negotiation", required:true},
  rentPrice: {type:Number, required:true},
  securityDeposit: {type:Number, required:true},
  rentalDuration: {type:Number, required:true},
  durationUnit: {type: String, enum: ["Day", "Week", "Month"], required: true},
  counterBy: {type:String, enum:["ownerCompany", "renterCompany"], required:true},
  isLatest: {type: Boolean, default: true},
  notes:{type:String, trim:true}
},
{
  timestamps: true
}
);

module.exports = mongoose.model("version", versionSchema)