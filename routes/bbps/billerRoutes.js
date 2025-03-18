const express = require("express");

const {billerInfo} = require("../../controllers/bbps/billerController");

const router = express.Router();


router.post("/biller-info", express.text(), billerInfo);
// router.post("/biller-decrypt", billerDec);



module.exports = router;