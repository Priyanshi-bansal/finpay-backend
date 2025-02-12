// router.js
const express = require('express');
const { getPlans } = require('../controllers/planController');
const {getPlanTypes} = require('../controllers/planController')
const router = express.Router();


router.get('/plansAPI', getPlans);
router.get('/plansTypeAPI', getPlanTypes);

module.exports = router;
