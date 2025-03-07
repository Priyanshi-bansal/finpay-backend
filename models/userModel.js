const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    isKycVerified: {
      type: Boolean,
      default: false,
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
      enum: ["Distributer", "Retailer", "Admin"],
      required: false,
    },
    status:{
      type: String, 
      enum: ["Pending", "Approved"], 
      default: "Pending",
      required: false,
    },
   
    plan: { type: mongoose.Schema.Types.ObjectId, ref: "Plan" },
    
    name: {
      type: String,
      required:true,
    },
    email: {
      type: String,
      required: true
    },
    mpin: {
      type: Number,
      required: true
    },
    mpin:{
      type:Number
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
