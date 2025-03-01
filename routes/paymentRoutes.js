const express = require("express");

const {payIn, payOut,callback, getPayInRes} = require('../controllers/payIn');

const router = express.Router();

router.post("/payIn", payIn);
router.post("/payOut", payOut);
router.get("/payIn/response", getPayInRes);
router.post("/payIn/callback", callback);

module.exports = router;
