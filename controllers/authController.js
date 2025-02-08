const User = require("../models/userModel");
const Wallet = require("../models/walletModel");
const { generateOtp, verifyOtp } = require("../services/otpService");
const { sendOtp } = require("../services/smsService");
const { generateJwtToken } = require("../services/jwtService");
const { default: axios } = require("axios");
require('dotenv').config();
const token = process.env.TOKEN;
console.log(token);
let temporaryData = {};

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


const aadhaarVerify = async(req, res)=>{
  const {aadharNumber} = req.body;
  if(!aadharNumber){
    res.send("Aadhar Number is required");
  }
  try {
    // Step 1: Generate OTP for the given Aadhaar number
    const generateOtpResponse = await axios.post(
      'https://kyc-api.surepass.io/api/v1/aadhaar-v2/generate-otp', 
      {
        id_number: aadharNumber
      },
      {
        headers:{
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.TOKEN}`

        }
      }
    );
    console.log(generateOtpResponse.data);
    return res.send({message:'OTP send successful', data: generateOtpResponse.data});
  } catch (error) {
    console.error('Error during Aadhaar verification:', error);
    return res.status(500).send('An error occurred during Aadhaar verification');
  }
}


const submitAadharOTP = async(req, res)=>{
  const {otp, client_id, userId} = req.body; 
  let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
 
    const submitOtpResponse = await axios.post(
      'https://kyc-api.surepass.io/api/v1/aadhaar-v2/submit-otp',
      {
        client_id: client_id, // Replace with your actual client_id
        otp: otp
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.TOKEN}` // Replace with your actual TOKEN
        }
      }
    );
    console.log(submitOtpResponse.data);
    const nameFromAadhar = submitOtpResponse.data.data.full_name;
    console.log("szdfxcgvhdfgchv",nameFromAadhar);
    user.aadharName = nameFromAadhar;
    await user.save();
    
    // Handle the response from OTP submission
    if (submitOtpResponse.data && submitOtpResponse.data.message_code === 'success') {
      return res.send({message:'Aadhaar verification successful', data: submitOtpResponse.data, name:nameFromAadhar});
    } else {
      return res.send('Aadhaar verification failed');
    }
  
}


  const verifyBank = async (req, res) => {
    const { id_number, ifsc, userId } = req.body;
    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    try {
      if (!id_number || !ifsc) {
        return res.status(400).json({ success: false, message: "IFSC number or ID is missing" });
      }
  
      // API URL
      const url = "https://kyc-api.surepass.io/api/v1/bank-verification/";
  
      // API Call
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
            Authorization: `Bearer ${process.env.TOKEN}`
          },
        }
      );
  
      console.log("Surepass API Response:", response.data);
      const nameFromBank = response.data.data.full_name;
      console.log("sdfghjfdgh",nameFromBank);
      user.bankName = nameFromBank;
      await user.save();

      return res.status(200).json({"pandata":response.data, success:true, name:nameFromBank});
    } catch (error) {
      console.error("Error in verifyBank:", error.message);
      return res.status(500).json({ success: false, message: "Error verifying bank details" });
    }
  };


  const verifyPAN = async (req, res) => {
    const {id_number,userId } = req.body;
    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    try {
      if (!id_number ) {
        return res.status(400).json({ success: false, message: "IFSC number missing" });
      }
  
      // API URL
      const url = 'https://kyc-api.surepass.io/api/v1/pan/pan';
  
      // API Call
      const response = await axios.post(
        url,
        {
          id_number,
        
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.TOKEN}`
          },
        }
      );
  
      console.log("Surepass API Response:", response.data);
      // Assuming the name is in response.data.name
      const nameFromPAN = response.data.data.full_name;
      console.log("wertfgyhjk",nameFromPAN);
      user.panName = nameFromPAN;
      await user.save();

      return res.status(200).json({success: true, name: nameFromPAN, data: response.data});
    } catch (error) {
      console.error("Error in pancard:", error.message);
      return res.status(500).json({ success: false, message: "Error verifying pan details" });
    }
  };

  const userVerify = async(req, res)=>{
    const {userId} = req.body;
   const user = await User.findById(userId);
   if(user.aadharName == user.panName && user.panName == user.bankName){
    user.isVerified = true;
    await user.save();
    return res.status(200).send("user verified successfully");
   }
   user.isVerified = false;
   await user.save();
   return res.status(400).send("Dismatched User details please Correct the information");

  }

module.exports = { sendOtpController, loginController, updateProfileController, aadhaarVerify , submitAadharOTP,verifyBank, verifyPAN, userVerify };

