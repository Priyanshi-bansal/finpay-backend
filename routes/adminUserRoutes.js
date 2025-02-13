const express = require("express");
const router = express.Router();
const adminUserController = require("../controllers/adminUserController");

router.post("/create", adminUserController.createUser);
router.get("/", adminUserController.getAllUsers);
router.get("/:id", adminUserController.getUserById);
router.put("/:id", adminUserController.updateUser);
router.delete("/:id", adminUserController.deleteUser);

module.exports = router;
