const OTP = require("../models/otpModel");

// Generate OTP
const generateOtp = async (mobileNumber) => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    await OTP.findOneAndUpdate(
      { mobileNumber },
      { otp, createdAt: new Date() },
      { upsert: true, new: true }
    );
    return otp;
  } catch (error) {
    console.error("Error generating OTP:", error);
    throw new Error("Failed to generate OTP");
  }
};

// Verify OTP
const verifyOtp = async (mobileNumber, enteredOtp) => {
  try {
    const record = await OTP.findOne({ mobileNumber });

    if (!record) {
      return { success: false, message: "OTP expired or invalid" };
    }

    if (record.otp !== enteredOtp) {
      return { success: false, message: "Incorrect OTP" };
    }

    await OTP.deleteOne({ mobileNumber }); // OTP is valid, delete it

    return { success: true, message: "OTP verified" };
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return { success: false, message: "Internal server error" };
  }
};

module.exports = { generateOtp, verifyOtp };
