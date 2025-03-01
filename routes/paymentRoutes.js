const express = require("express");

const {payIn, callbackPayIn, getPayInRes, payInReportAllUsers} = require('../controllers/payIn');
const {payOut, callbackPayout, payOutReportAllUsers} = require("../controllers/payOut");

const router = express.Router();

router.post("/payIn", payIn);
router.post("/payOut", payOut);
router.get("/payIn/response", getPayInRes);
router.post("/payIn/callback", callbackPayIn);
router.post("/payOut/callback", callbackPayout);
router.get("/payIn/report", payInReportAllUsers);
router.get("/payOut/report", payOutReportAllUsers);

module.exports = router;
