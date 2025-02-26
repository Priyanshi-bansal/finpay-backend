const express = require("express");
const router = express.Router();
const adminUserController = require("../../controllers/admin/adminUserController");
const MainWallet = require("../../controllers/admin/mainwallet");

router.post("/create", adminUserController.createUser);
router.post("/login" , adminUserController.loginController);
router.get("/alluserwallet", MainWallet.payingwalletreport);

module.exports = router;
