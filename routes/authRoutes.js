const express = require("express");

const { sendOtpController, verifyOTPController, registerUser, loginController, getAlluserController, getUserController, updateProfileController, aadhaarVerify, submitAadharOTP,verifyBank,verifyPAN, userVerify } = require("../controllers/authController");


const router = express.Router();

router.post("/send-otp", sendOtpController);
router.post("/verify-otp",verifyOTPController);
router.post("/login", loginController);
router.post("/register", registerUser);
router.get("/alluser", getAlluserController);
router.get("/view/:id", getUserController);
router.put("/update-profile", updateProfileController); 
router.post('/aadhar-verify',aadhaarVerify);
router.post('/submit-aadhar-otp',submitAadharOTP);
router.post("/verifybank", verifyBank);
router.post("/verifyPAN", verifyPAN);
router.post("/verifyUser", userVerify);

module.exports = router;