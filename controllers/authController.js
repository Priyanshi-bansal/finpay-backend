const User = require("../models/userModel");
const Wallet = require("../models/walletModel");
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

// Update User Profile (Name and Email)
const updateProfileController = async (req, res) => {
  try {
    const { userId, name, email } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Find user by ID
    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user profile with new name and email (if provided)
    if (name) {
      user.name = name;
    }
    if (email) {
      user.email = email;
    }

    // Save updated user details
    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        mobileNumber: user.mobileNumber,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Error in updateProfileController:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { sendOtpController, loginController, updateProfileController };
