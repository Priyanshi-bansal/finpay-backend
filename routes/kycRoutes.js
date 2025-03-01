const express = require("express");

const { aadhaarVerify, submitAadharOTP,verifyBank,verifyPAN, userVerify } = require("../controllers/kycController");


const router = express.Router();

router.post('/aadhar-verify',aadhaarVerify);
router.post('/submit-aadhar-otp',submitAadharOTP);
router.post("/verifybank", verifyBank);
router.post("/verifyPAN", verifyPAN);
router.post("/verifyUser", userVerify);

module.exports = router;