const express = require("express");

const {payIn, callbackPayIn, getPayInRes, payInReportAllUsers, payInReportForUser} = require('../controllers/payIn');
const {payOut, adminAction, callbackPayout, payOutReportAllUsers, payOutReportForUser} = require("../controllers/payOut");
const {combinedReportForUser} = require("../controllers/combinedReportForUser ");
const router = express.Router();

router.post("/payIn", payIn);
router.post("/payOut", payOut);
router.post("/payout/admin-action", adminAction);
router.get("/payIn/response", getPayInRes);
router.post("/payIn/callback", callbackPayIn);
router.post("/payOut/callback", callbackPayout);
router.get("/payIn/report", payInReportAllUsers);
router.get("/payOut/report", payOutReportAllUsers);
router.get("/payIn/user/report", payInReportForUser);
router.get("/payOut/user/report", payOutReportForUser);
router.get("/user/report", combinedReportForUser);

module.exports = router;
