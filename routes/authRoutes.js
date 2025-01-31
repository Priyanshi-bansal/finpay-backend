const express = require("express");
const { sendOtpController, loginController } = require("../controllers/authController");

const router = express.Router();

router.post("/send-otp", sendOtpController);
router.post("/login", loginController);

module.exports = router;
