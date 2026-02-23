const express = require("express");
const router = express.Router();
const { createUser, loginUser, getUsers, getCurrentUser } = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");
const rbac = require("../middlewares/rbacMiddleware");

// Public
router.post("/register", createUser);
router.post("/login", loginUser);

// Protected
router.get("/", protect, rbac({ roles: ["admin"], permissions: ["view_user"] }), getUsers);
router.get("/me", protect, getCurrentUser);

module.exports = router;
