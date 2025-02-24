const express = require("express");

const {payIn, payOut,callback} = require('../controllers/paymentController');

const router = express.Router();

router.post("/payIn", payIn);
router.post("/payOut", payOut);
router.post("/payIn/response", callback);
// router.post("/payIn/callback", callback);

module.exports = router;
