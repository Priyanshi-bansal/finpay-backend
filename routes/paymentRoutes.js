const express = require("express");

const {payIn, payOut, callbackPayIn,callback} = require('../controllers/paymentController');

const router = express.Router();

router.post("/payIn", payIn);
router.post("/payOut", payOut);
router.post("/payIn/response", callbackPayIn);
router.post("/payIn/callback", callback);

module.exports = router;
