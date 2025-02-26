const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const Wallet = require("../models/walletModel");
const { generateOtp, verifyOtp } = require("../services/otpService");
const { sendOtp } = require("../services/smsService");
const { generateJwtToken } = require("../services/jwtService");
const { default: axios } = require("axios");
require("dotenv").config();
const token = process.env.TOKEN;
console.log(token);

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
    console.log("otp", smsResult);

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
 
// Verify OTP controller
const verifyOTPController = async (req, res) => {
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

    return res.status(200).json({
      message: "OTP verified successful",
    });
  } catch (error) {
    console.error("Error in verifyOTPController:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

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

    let user = await User.findOne({ mobileNumber });


    if (!user) {
      return res.status(404).json("No user found");
    }

    const token = generateJwtToken(user._id);

    user.token = token;
    await user.save();

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        mobileNumber: user.mobileNumber,
        token: user.token,
      },
    });
  } catch (error) {
    console.error("Error in loginController:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, email, mobileNumber, password, mpin } = req.body;

    let user = await User.findOne({ email }); 

    if (user) {
      return res.status(400).json("User already exists");
    }

    let crptPass = await bcrypt
      .hash(password, 10)
      .then((hash) => {
        return hash;
      })
      .catch((err) => console.error("Error hashing password:", err.message));

    user = await User.create({ name, email, mobileNumber, password: crptPass, mpin });

    // Initialize wallcsccschdakkskdh priya
    await Wallet.create({ userId: user._id, balance: 0 });
    
    await user.save();

    return res.status(200).json({
      message: "Registration successful",
      user: user,
    });
  } catch (error) {
    console.error("Error in registerUser controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const updateProfileController = async (req, res) => {
  try {
    const { userId, name, email, mobileNumber,  } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user profile with new name and email 
    if (name) {
      user.name = name;
    }
    if (email) {
      user.email = email;
    }
    if (mobileNumber) {
      user.mobileNumber = mobileNumber;
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        mobileNumber: user.mobileNumber,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error in updateProfileController:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAlluserController = async (req, res) => {
  try {
    // Get page, limit, and search query from request query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const searchQuery = req.query.search || ''; 

    // Build search criteria if there's a search query
    const searchCriteria = searchQuery
      ? {
          $or: [
            { name: { $regex: searchQuery, $options: 'i' } }, 
            { email: { $regex: searchQuery, $options: 'i' } }, 
          ],
        }
      : {};

    // Calculate the number of users to skip
    const skip = (page - 1) * limit;

    // Fetch users with pagination and search criteria
    const result = await User.find(searchCriteria)
      .skip(skip)
      .limit(limit);

    if (!result || result.length === 0) {
      return res.status(404).send("No users found");
    }

    // Get the total number of users matching the search criteria
    const totalUsers = await User.countDocuments(searchCriteria);

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalUsers / limit);

    return res.status(200).json({
      data: result,
      pagination: {
        totalUsers,
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
    });
  } catch (error) {
    console.error("Error in getAlluserController:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getUserController = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("No user found");
    }
    user = user.toObject();  // Convert Mongoose document to plain object
    return res.status(200).send(user);
  } catch (error) {
    console.error("Error in getUserController:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}; 

const aadhaarVerify = async (req, res) => {
  const { aadharNumber } = req.body;
  if (!aadharNumber) {
    res.send("Aadhar Number is required");
  }
  try {
  
    const generateOtpResponse = await axios.post(
      "https://kyc-api.surepass.io/api/v1/aadhaar-v2/generate-otp",
      {
        id_number: aadharNumber,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.TOKEN}`,
        },
      }
    );
    console.log(generateOtpResponse.data);
    return res.send({
      message: "OTP send successful",
      data: generateOtpResponse.data,
    });
  } catch (error) {
    console.error("Error during Aadhaar verification:", error.message);
    return res
      .status(500)
      .send("An error occurred during Aadhaar verification");
  }
};

const submitAadharOTP = async (req, res) => {
  const { otp, client_id, userId } = req.body;
  let user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const submitOtpResponse = await axios.post(
    "https://kyc-api.surepass.io/api/v1/aadhaar-v2/submit-otp",
    {
      client_id: client_id, 
      otp: otp,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.TOKEN}`, 
      },
    }
  );
  console.log(submitOtpResponse.data.data);
  const nameFromAadhar = submitOtpResponse.data.data;
  console.log("name in aadhar card", nameFromAadhar);
  user.aadharDetails = nameFromAadhar;
  await user.save();

  if (
    submitOtpResponse.data &&
    submitOtpResponse.data.message_code === "success"
  ) {
    return res.send({
      message: "Aadhaar verification successful",
      data: submitOtpResponse.data,
      name: nameFromAadhar,
    });
  } else {
    return res.send("Aadhaar verification failed");
  }
};

const verifyBank = async (req, res) => {
  const { id_number, ifsc, userId } = req.body;
  let user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  try {
    if (!id_number || !ifsc) {
      return res
        .status(400)
        .json({ success: false, message: "IFSC number or ID is missing" });
    }

    const url = "https://kyc-api.surepass.io/api/v1/bank-verification/";

    const response = await axios.post(
      url,
      {
        id_number,
        ifsc,
        ifsc_details: true,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.TOKEN}`,
        },
      }
    );

    console.log("Surepass API Response:", response.data);
    const nameFromBank = response.data.data;
    console.log("name in bank account", nameFromBank);
    user.bankDetails = nameFromBank;
    await user.save();

    return res
      .status(200)
      .json({ pandata: response.data, success: true, name: nameFromBank });
  } catch (error) {
    console.error("Error in verifyBank:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Error verifying bank details" });
  }
};

const verifyPAN = async (req, res) => {
  const { id_number, userId } = req.body;
  let user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  try {
    if (!id_number) {
      return res
        .status(400)
        .json({ success: false, message: "IFSC number missing" });
    }

    const url = "https://kyc-api.surepass.io/api/v1/pan/pan";

    const response = await axios.post(
      url,
      {
        id_number,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.TOKEN}`,
        },
      }
    );

    console.log("Surepass API Response:", response.data);

    const nameFromPAN = response.data.data;
    console.log("name in pancard", nameFromPAN);
    user.panDetails = nameFromPAN;
    await user.save();

    return res
      .status(200)
      .json({ success: true, name: nameFromPAN, data: response.data });
  } catch (error) {
    console.error("Error in pancard:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Error verifying pan details" });
  }
};

const normalizeName = (name) => {
  const prefixList = ["Mr", "Ms", "Mrs", "Dr"];
  prefixList.forEach((prefix) => {
    if (name.startsWith(prefix)) {
      name = name.replace(prefix, "").trim();
    }
  });
  name = name.toLowerCase().replace(/\s+/g, " ");
  return name;
};

const userVerify = async (req, res) => {
  const { userId } = req.body;
  const user = await User.findById(userId);
  if (!user) {
    return "User not found!";
  }

  const normalizedAadharName = normalizeName(user.aadharDetails.full_name);
  const normalizedPanName = normalizeName(user.panDetails.full_name);
  const normalizedBankName = normalizeName(user.bankDetails.full_name);

  if (
    normalizedAadharName == normalizedPanName &&
    normalizedPanName == normalizedBankName
  ) {
    user.isVerified = true;
    await user.save();
    return res.status(200).send("user verified successfully");
  }
  user.isVerified = false;
  await user.save();
  return res
    .status(400)
    .send("Dismatched User details please Correct the information");
};


module.exports = {
  sendOtpController,
  verifyOTPController,
  registerUser,
  loginController,
  getAlluserController,
  getUserController,
  updateProfileController,
  aadhaarVerify,
  submitAadharOTP,
  verifyBank,
  verifyPAN,
  userVerify,
};
