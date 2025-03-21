const express = require("express");

const { billerInfo,billFetch,billpayment,transactionstatus,complaintregistration,complainttracking,billvalidation,plan} = require("../../controllers/bbps/billerController");

const router = express.Router();

router.post("/biller-info", express.text(), billerInfo);
router.post("/billFetch", express.json(),  billFetch);
router.post("/billpayment",  billpayment);
router.post("/transactionstatus", express.text(), transactionstatus);
router.post("/complaintregistration", express.text(), complaintregistration);
router.post("/complainttracking", express.text(), complainttracking);
router.post("/billvalidation", express.text(), billvalidation);
router.post("/plan", express.text(), plan);

module.exports = router;