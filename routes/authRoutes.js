const express = require("express");
const { sendOtpController, loginController, updateUser } = require("../controllers/authController");

const router = express.Router();

router.post("/send-otp", sendOtpController);
router.post("/login", loginController);
router.put('/update-profile', updateUser);
module.exports = router;
