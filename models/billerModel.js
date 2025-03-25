const mongoose = require("mongoose");

const billerSchema = new mongoose.Schema({
  billerId: { type: String, required: true, unique: true },
  billerAliasName: String,
  billerName: String,
  billerCategory: String,
  billerCoverage: String,
  billerFetchRequiremet: String,
  billerPaymentExactness: String,
  billerSupportBillValidation: String,
  billerInputParams: Array,
  billerAmountOptions: String,
  billerPaymentModes: String,
  billerDescription: String,
  supportPendingStatus: String,
  supportDeemed: String,
  billerTimeout: String,
  billerPaymentChannels: Array,
  billerAdditionalInfo: Array,
  billerStatus: String,
});

module.exports = mongoose.model("Biller", billerSchema);
