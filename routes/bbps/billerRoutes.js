const express = require("express");

const {billerInfoenc, billerInfo} = require("../../controllers/bbps/billerController");

const router = express.Router();


router.post("/biller-info-enc", express.text(), billerInfoenc);

router.post("/biller-info", billerInfo);
// router.post("/biller-decrypt", billerDec);



module.exports = router;