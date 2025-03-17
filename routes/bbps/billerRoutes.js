const express = require("express");

const {billerInfo} = require("../../controllers/bbps/billerController");

const router = express.Router();

router.post("/biller-info", express.text(), billerInfo);


module.exports = router;