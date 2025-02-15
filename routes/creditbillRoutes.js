const express = require('express');
const router = express.Router();

const {validate,viewbill} = require('../controllers/creditbillController');

router.post('/validate', validate);
router.post('/viewbill', viewbill);

module.exports = router;