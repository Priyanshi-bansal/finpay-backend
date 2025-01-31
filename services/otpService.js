const OTP = require("../models/otpModel");

// Generate OTP and save to the database
const generateOtp = async (mobileNumber) => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

    // Save OTP to the database
    await OTP.create({ mobileNumber, otp });

    return otp;
  } catch (error) {
    console.error("Error generating OTP:", error);
    throw new Error("Failed to generate OTP");
  }
};

// Verify OTP from the database
const verifyOtp = async (mobileNumber, enteredOtp) => {
  try {
    const record = await OTP.findOne({ mobileNumber }).sort({ createdAt: -1 });

    if (!record) {
      return { success: false, message: "OTP expired or invalid" };
    }

    if (record.otp !== enteredOtp) {
      return { success: false, message: "Incorrect OTP" };
    }

    // OTP is valid; delete it from the database
    await OTP.deleteMany({ mobileNumber });

    return { success: true, message: "OTP verified" };
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return { success: false, message: "Internal server error" };
  }
};

module.exports = { generateOtp, verifyOtp };
