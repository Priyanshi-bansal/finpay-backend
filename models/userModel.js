const mongoose = require("mongoose");
require("./servicePlanmodel");
const { format } = require("date-fns");  // Importing date-fns

const Schema = mongoose.Schema;

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
  {
    timestamps: true,  // This automatically adds createdAt and updatedAt fields
    toJSON: { getters: true },  // Apply getters for JSON conversion
    toObject: { getters: true }  // Apply getters for object conversion
  }
);

// Adding custom getter to format the `createdAt` and `updatedAt` fields
userSchema.path('createdAt').get(function(val) {
  return format(val, "MMM dd, yyyy h:mma");  // Formatting the date for `createdAt`
});

userSchema.path('updatedAt').get(function(val) {
  return format(val, "MMM dd, yyyy h:mma");  // Formatting the date for `updatedAt`
});

module.exports = mongoose.model("User", userSchema);
