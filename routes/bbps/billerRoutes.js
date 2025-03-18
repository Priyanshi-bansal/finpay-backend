const express = require("express");

const {billerInfo,billerDec} = require("../../controllers/bbps/billerController");

const router = express.Router();


router.post("/biller-info", billerInfo);
router.post("/biller-decrypt", billerDec);



module.exports = router;