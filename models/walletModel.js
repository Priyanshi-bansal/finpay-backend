const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    credit:{
      type: Number,
      default: 0
    },
    debit: {
      type: Number,
      default: 0
    },
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wallet", walletSchema);
