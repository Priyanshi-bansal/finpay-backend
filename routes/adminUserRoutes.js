const express = require("express");
const router = express.Router();
const adminUserController = require("../controllers/adminUserController");

router.post("/create", adminUserController.createUser);
router.get("/alluserwallet", adminUserController.payingwalletreport);

module.exports = router;
