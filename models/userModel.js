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
    panDetails: {
      type: Object,
      required: false,
    },
    bankDetails: {
      type: Object,
      required: false,
    },
    aadharDetails: {
      type: Object,
      required: false,
    },
    role: {
      type: String,
      enum: ["Distributer", "Retailer"],
      default: "Distributer" ,
      required: false,
    },
    status:{
      type: String, 
      enum: ["Pending", "Approved"], 
      default: "Pending",
      required: false,
    },
    services: {
      type: [String],
      required: false,
      default: [],
    },
    name: {
      type: String,
      required:true,
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    payInWallet:{
      type: Number,
      default: 0,
    },
    payOutWallet: {
      type: Number,
      default: 0,
    },
    mpin:{
      type:Number
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
