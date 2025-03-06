const express = require("express");

const {billerInfo} = require("../../controllers/bbps/billerController");

const router = express.Router();

router.post("/biller-info", billerInfo);


module.exports = router;