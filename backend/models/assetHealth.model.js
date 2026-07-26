const mongoose = require("mongoose");

const assetHealthSchema = new mongoose.Schema({

    assetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "asset",
        required: true,
    },

    healthScore: {
        type: Number,
        default: 100
    },

    usageHours: {
        type: Number,
        default: 0
    },

    breakdownCount: {
        type: Number,
        default: 0
    },

    maintenanceCount: {
        type: Number,
        default: 0
    },

    totalMaintenanceCost: {
        type: Number,
        default: 0
    },

    recommendation: {
        type: String,
        enum: [
            "Healthy",
            "Maintenance Required",
            "Recommend Replacement",
            "Recommend Selling"
        ],
        default: "Healthy"
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("assetHealth", assetHealthSchema);