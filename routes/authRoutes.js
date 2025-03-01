const express = require("express");

const { sendOtpController, verifyOTPController, registerUser, loginController, getAlluserController, getUserController, updateProfileController } = require("../controllers/authController");


const router = express.Router();

router.post("/send-otp", sendOtpController);
router.post("/verify-otp",verifyOTPController);
router.post("/login", loginController);
router.post("/register", registerUser);
router.get("/alluser", getAlluserController);
router.get("/view/:id", getUserController);
router.put("/update-profile", updateProfileController); 


module.exports = router;