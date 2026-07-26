const mongoose = require('mongoose')

const assetSchema = new mongoose.Schema({

  assetCode:{
    type:String,
    required:true,
    unique:true,
    trim:true
  },

  companyId:{type:mongoose.Schema.Types.ObjectId, ref:"company", required:true},

  assetCategoryId:{type:mongoose.Schema.Types.ObjectId, ref:"AssetCategory", required:true},

  assetName:{
    type: String,
    required:[true, "Name asset is required"],
    minlength:2,
    trim:true
  },

  assetImages:[String],

  description :{
    type: String,
    required:[true, "description asset is required"],
    minlength:2,
    trim:true
  },

  price: {
    daily:{
      type:Number,
      required:true
    },
    weekly: Number,
    monthly: Number
    },

    status: {
    type: String,
    enum: [
        "Available",
        "Booked",
        "Maintenance",
        "Inactive"
    ],
    default: "Available"
  },
  //added by eman - sprint 6
  healthScore: {
  type: Number,
  min: 0,
  max: 100,
  default: 100,
},

  location:{
    type: String,
    trim:true
  }

},

{
    timestamps: true
}
)

module.exports = mongoose.model("asset", assetSchema)