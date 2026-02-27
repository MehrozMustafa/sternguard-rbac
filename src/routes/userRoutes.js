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


// Public routes
// Register new user
router.post("/register", createUser);

// Login user
router.post("/login", loginUser);

// Protected routes
// Get current logged-in user
// Requires authentication only
router.get(
  "/me",
  protect,
  getCurrentUser
);

// Get all users
// Requires "view_user" permission
router.get(
  "/",
  protect,
  rbac({ permissions: ["view_user"] }),
  getUsers
);


module.exports = router;
