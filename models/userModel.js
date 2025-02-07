const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String, // Stores the JWT token
    },
    panName: {
      type: String,
      required: false,
    },
    bankName: {
      type: String,
      required: false,
    },
    aadharName: {
      type: String,
      required: false,
    }
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
