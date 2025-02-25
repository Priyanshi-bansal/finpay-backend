const express = require("express");
const router = express.Router();
const adminUserController = require("./adminUserController");

router.post("/create", adminUserController.createUser);
router.post("/login",adminUserController.loginController);
router.get("/", adminUserController.getAllUsers);
router.get("/:id", adminUserController.getUserById);
router.put("/:id", adminUserController.updateUser);
router.delete("/:id", adminUserController.payingwalletreport);

module.exports = router;
