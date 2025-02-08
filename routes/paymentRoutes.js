const express = require("express");

const {payIn, payOut} = require('../controllers/paymentController');

const router = express.Router();

router.post("/payIn", payIn);
router.post("/payOut", payOut);

module.exports = router;
