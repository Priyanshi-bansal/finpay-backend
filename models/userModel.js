const mongoose = require("mongoose");
require("./servicePlanmodel");

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
    status: {
      type: String,
      enum: ["Pending", "Approved"],
      default: "Pending",
      required: false,
    },

    plan: {
      planId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ServicePlan",
        default: null,
      },
      planType: {
        type: String,
        enum: ["monthly", "quarterly", "half-yearly", "yearly"],
        default: null,
      },
      startDate: { type: Date, default: null },
      endDate: { type: Date, default: null },
    },

    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mpin: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
