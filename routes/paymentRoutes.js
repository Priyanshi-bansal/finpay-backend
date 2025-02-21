const express = require("express");

const {payIn, payOut, callbackPayIn} = require('../controllers/paymentController');

const router = express.Router();

router.post("/payIn", payIn);
router.post("/payOut", payOut);
router.get("/payIn/response", callbackPayIn);

module.exports = router;
