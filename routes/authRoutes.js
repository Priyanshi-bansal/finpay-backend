const express = require("express");
const { sendOtpController, loginController, updateUser, aadhaarVerify, submitAadharOTP,verifyBank,verifyPAN} = require("../controllers/authController");

const router = express.Router();

router.post("/send-otp", sendOtpController);
router.post("/login", loginController);
router.put('/update-profile', updateUser);
router.post('/aadhar-verify',aadhaarVerify);
router.post('/submit-aadhar-otp',submitAadharOTP);
router.post("/verifybank", verifyBank);
router.post("/verifyPAN", verifyPAN);
module.exports = router;
