const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
      unique: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
      required: false,
    },
    
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
