const express = require("express");
const router = express.Router();

const {
  createUser,
  loginUser,
  getUsers,
  getCurrentUser,
} = require("../controllers/userController");

const { protect } = require("../middlewares/authMiddleware");
const rbac = require("../middlewares/rbacMiddleware");

// ------------------------
// Public routes
// ------------------------
router.post("/register", createUser);
router.post("/login", loginUser);

// ------------------------
// Protected routes
// ------------------------

// Get all users → only admin with "view_user" permission
router.get("/", protect, rbac({ roles: ["admin"], permissions: ["view_user"] }), getUsers);

// Get current logged-in user info → any authenticated user
router.get("/me", protect, getCurrentUser);

module.exports = router;
