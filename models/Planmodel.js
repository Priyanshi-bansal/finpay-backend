const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Basic, Advance, Business
  services: [{ type: String, required: true }], // ["Mobile Recharge", "Train Booking", "Flight Booking"]
});

module.exports = mongoose.model("Plan", planSchema);