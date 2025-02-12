const mongoose = require("mongoose");

const adminUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "sub-admin", "user"], default: "user" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdminUser", adminUserSchema);
