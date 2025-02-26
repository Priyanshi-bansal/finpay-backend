const express = require("express");

const {billerInfo, billFetch} = require("../../controllers/bbps/billerController");

const router = express.Router();

router.post("/biller-info", billerInfo);
router.post("bill-fetch",billFetch);

module.exports = router;