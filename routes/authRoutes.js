const express = require("express");

const { sendOtpController,registerUser, loginController, getAlluserController, getUserController, updateProfileController, aadhaarVerify, submitAadharOTP,verifyBank,verifyPAN, userVerify, registerUser } = require("../controllers/authController");


const router = express.Router();

router.post("/send-otp", sendOtpController);
router.post("/login", loginController);
router.post("/register", registerUser);
router.get("/", getAlluserController);
router.get("/:id", getUserController);
router.put("/update-profile", updateProfileController); // Profile update route added
router.post('/aadhar-verify',aadhaarVerify);
router.post('/submit-aadhar-otp',submitAadharOTP);
router.post("/verifybank", verifyBank);
router.post("/verifyPAN", verifyPAN);
router.post("/verifyUser", userVerify);
router.post("/register", registerUser);

module.exports = router;