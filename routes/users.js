const express = require("express");
const router = express.Router();
const { getAllUsers, getUserById, updateUserRole, deleteUser } = require("../controllers/userController");
const { auth, admin } = require("../middleware/admin");

router.get("/", auth, admin, getAllUsers);
router.get("/:id", auth, admin, getUserById);
router.put("/:id", auth, admin, updateUserRole);
router.delete("/:id", auth, admin, deleteUser);

module.exports = router;
