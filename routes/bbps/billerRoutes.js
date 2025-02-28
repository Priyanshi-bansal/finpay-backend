const express = require("express");

const {billerInfo, billFetch, billPayment} = require("../../controllers/bbps/billerController");

const router = express.Router();

router.post("/biller-info", billerInfo);
router.post("/bill-fetch",billFetch);
router.post("bill-payment", billPayment);

module.exports = router;