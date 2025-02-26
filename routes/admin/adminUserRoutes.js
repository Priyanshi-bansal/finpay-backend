const express = require("express");
const router = express.Router();
const adminUserController = require("../../controllers/admin/adminUserController");
const MainWallet = require("../../controllers/admin/mainwallet");
const plan = require("../../controllers/admin/AssignService");

router.post("/create", adminUserController.createUser);
router.post("/login" , adminUserController.loginController);
router.get("/alluserwallet", MainWallet.payingwalletreport);
router.post("/planCreate", plan.createPlan);
router.post("/planassign/:id", plan.assignPlanToUser);

module.exports = router;
