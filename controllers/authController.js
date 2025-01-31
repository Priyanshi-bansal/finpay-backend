const User = require("../models/userModel");
const Wallet = require("../models/walletModel"); // Import wallet model
const { generateOtp, verifyOtp } = require("../services/otpService");
const { sendOtp } = require("../services/smsService");
const { generateJwtToken } = require("../services/jwtService");

// Send OTP to the user
const sendOtpController = async (req, res) => {
  try {
    const { mobileNumber } = req.body;

    if (!mobileNumber) {
      return res.status(400).json({ message: "Mobile number is required" });
    }

    // Generate OTP
    const otp = await generateOtp(mobileNumber);

    // Send OTP via SMS
    const smsResult = await sendOtp(mobileNumber, otp);

    if (smsResult.success) {
      return res.status(200).json({ message: "OTP sent successfully" });
    } else {
      return res.status(400).json({ message: smsResult.message });
    }
  } catch (error) {
    console.error("Error in sendOtpController:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Verify OTP and login user
const loginController = async (req, res) => {
  try {
    const { mobileNumber, otp } = req.body;

    if (!mobileNumber || !otp) {
      return res.status(400).json({ message: "Mobile number and OTP are required" });
    }

    // Verify OTP
    const verificationResult = await verifyOtp(mobileNumber, otp);

    if (!verificationResult.success) {
      return res.status(400).json({ message: verificationResult.message });
    }

    // Check if user exists
    let user = await User.findOne({ mobileNumber });

    if (!user) {
      // Create a new user if not exists
      user = await User.create({ mobileNumber, isVerified: true });

      // Initialize wallet with default balance for a new user
      await Wallet.create({ userId: user._id, balance: 0 });
    } else {
      // Update the user's verification status
      user.isVerified = true;
    }

    // Generate a JWT token
    const token = generateJwtToken(user._id);

    // Save the token in the database
    user.token = token;
    await user.save();

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        mobileNumber: user.mobileNumber,
        isVerified: user.isVerified,
        token: user.token,
      },
    });
  } catch (error) {
    console.error("Error in loginController:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { sendOtpController, loginController };
