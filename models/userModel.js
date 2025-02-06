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
    email: {type: String, required: false},
    name: {type: String, required: false},
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
