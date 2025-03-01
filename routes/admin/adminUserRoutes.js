const express = require("express");
const router = express.Router();
const MainWallet = require("../../controllers/admin/mainwallet");
const plan = require("../../controllers/admin/AssignService");


router.get("/alluser", plan.getAlluserController);
router.get("/alluserwallet", MainWallet.payingwalletreport);
router.post("/planCreate", plan.createPlan);
router.post("/planassign/:id", plan.assignPlanToUser);

module.exports = router;
