const express = require("express");
const { sendOtpController, loginController, updateProfileController } = require("../controllers/authController");

const router = express.Router();

router.post("/send-otp", sendOtpController);
router.post("/login", loginController);
router.put("/update-profile", updateProfileController); // Profile update route added

module.exports = router;
