const User = require("../models/userModel");
const Wallet = require("../models/walletModel"); // Import wallet model
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

const updateUser = async(req, res)=>{
  try {
    const {mobileNumber, name, email, userId} = req.body;
  if(!mobileNumber || !name || !email){
    res.send("All fields are required");
  }
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  const updateUser = User.findByIdAndUpdate(userId,
    {name, email},
    { new: true }
  );
  res.send(updateUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating user details' });
  }
}

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
  const {otp, client_id} = req.body;

 
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

    // Handle the response from OTP submission
    if (submitOtpResponse.data && submitOtpResponse.data.message_code === 'success') {
      return res.send({message:'Aadhaar verification successful', data: submitOtpResponse.data});
    } else {
      return res.send('Aadhaar verification failed');
    }
  
}


  const verifyBank = async (req, res) => {
    const { id_number, ifsc } = req.body;
  
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
  
      return res.status(200).json(response.data);
    } catch (error) {
      console.error("Error in verifyBank:", error.message);
      return res.status(500).json({ success: false, message: "Error verifying bank details" });
    }
  };
  const verifyPAN = async (req, res) => {
    const {id_number } = req.body;
  
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
  
      return res.status(200).json(response.data);
    } catch (error) {
      console.error("Error in pancard:", error.message);
      return res.status(500).json({ success: false, message: "Error verifying pan details" });
    }
  };

module.exports = { sendOtpController, loginController, updateUser, aadhaarVerify , submitAadharOTP,verifyBank, verifyPAN};
