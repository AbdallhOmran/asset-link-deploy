const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, "Company Name is required"],
      minlength: 2,
      trim: true,
    },
    displayName: {
      type: String,
      trim: true,
      default: "",
    },
    companyEmail: {
      type: String,
      required: [true, "Company Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    companyLogo: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    companyAddress: {
      type: String,
      default: "",
      trim: true,
    },
    industry: {
      type: String,
      default: "",
      trim: true,
    },
    companySize: {
      type: String,
      default: "",
      trim: true,
    },
    yearFounded: {
      type: Number,
      default: null,
    },
    website: {
      type: String,
      default: "",
      trim: true,
    },
    city: {
      type: String,
      default: "",
      trim: true,
    },
    state: {
      type: String,
      default: "",
      trim: true,
    },
    zipCode: {
      type: String,
      default: "",
      trim: true,
    },
    country: {
      type: String,
      default: "",
      trim: true,
    },
    commercialRegistrationNumber: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    taxRegister: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["Company", "Admin"],
      default: "Company",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpire: {
      type: Date,
    },
    reputationScore: {
      type: Number,
      default: 100,
    },
    companyType: {
      type: String,
      enum: ["Renter", "Owner", "Both"],
      default: "Both",
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Pre-validate hook: sanitize sparse unique fields.
 * MongoDB sparse indexes only skip documents where the field is MISSING (undefined).
 * If the field is explicitly set to null or "", the index treats it as a real value
 * and enforces uniqueness — causing E11000 duplicate key errors.
 * This hook ensures empty/null values are removed from the document entirely.
 */
const sparseUniqueFields = ['taxRegister', 'commercialRegistrationNumber'];

companySchema.pre('validate', function (next) {
  for (const field of sparseUniqueFields) {
    if (this[field] === null || this[field] === '' || this[field] === undefined) {
      this[field] = undefined;
    }
  }
  next();
});

module.exports = mongoose.model("company", companySchema);