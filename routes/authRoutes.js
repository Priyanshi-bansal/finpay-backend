const express = require("express");

const { sendOtpController, loginController, updateProfileController, aadhaarVerify, submitAadharOTP,verifyBank,verifyPAN, userVerify } = require("../controllers/authController");


const router = express.Router();

router.post("/send-otp", sendOtpController);
router.post("/login", loginController);
router.put("/update-profile", updateProfileController); // Profile update route added
router.post('/aadhar-verify',aadhaarVerify);
router.post('/submit-aadhar-otp',submitAadharOTP);
router.post("/verifybank", verifyBank);
router.post("/verifyPAN", verifyPAN);
router.get("/verifyUser", userVerify);

module.exports = router;