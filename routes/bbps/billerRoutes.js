const express = require("express");

const { billerInfo,billFetch,billpayment,transactionstatus,complaintregistration,complainttracking,billvalidation,plan} = require("../../controllers/bbps/billerController");

const router = express.Router();

router.post("/biller-info", express.text(), billerInfo);
router.post("/billFetch", express.json(), billFetch);
router.post("/billpayment", billpayment);
router.post("/transactionstatus", transactionstatus);
router.post("/complaintregistration", complaintregistration);
router.post("/complainttracking", complainttracking);
router.post("/billvalidation", billvalidation);
router.post("/plan", plan);

module.exports = router;