const express = require("express");
const router = express.Router();
const MainWallet = require("../../controllers/admin/mainwallet");
const plan = require("../../controllers/admin/AssignService");
const paymentRequest = require("../../controllers/admin/paymentRequestController");

router.get("/alluser", plan.getAlluserController);
router.get("/export-users", plan.exportUsersToExcel);
router.get("/alluserwallet", MainWallet.allUserWalletreport);
router.get("/userwallet/:userId", MainWallet.userWalletreport);
router.post("/planCreate", plan.createPlan);
router.post("/planassign/:id", plan.assignPlanToUser);
router.post("/payment-request", paymentRequest.addPaymentRequest);

module.exports = router;
