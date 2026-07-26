    const mongoose = require("mongoose")

    const inspectionSchema = new mongoose.Schema({

        bookingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "booking",
            required: true,
        },

        assetId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "asset",
            required: true
        },
        inspectorName: {
        type: String,
        required: true
    },

        photos: [{
            type: String
        }],

        notes: {
            type: String,
            default: ""
        },

        checklist: {
            brakes: {
                type: Boolean,
                default: false
            },
            engine: {
                type: Boolean,
                default: false
            },
            body: {
                type: Boolean,
                default: false
            },
            tires: {
                type: Boolean,
                default: false
            },
            lights: {
                type: Boolean,
                default: false
            }
        },

        conditionScore: {
            type: Number,
            min: 0,
            max: 100,
            required: true
        },

        status: {
            type: String,
            enum: ["Passed", "Failed"],
            required: true
        }

    }, {
        timestamps: true
    });

    module.exports = mongoose.model("inspection", inspectionSchema)