const express = require("express");
const router = express.Router();
const adminUserController = require("../../controllers/admin/adminUserController");

router.post("/create", adminUserController.createUser);
router.post("/login" , adminUserController.loginController);
router.get("/alluserwallet", adminUserController.payingwalletreport);

module.exports = router;
