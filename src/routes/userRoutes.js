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
router.post("/register", createUser);
router.post("/login", loginUser);


// Protected routes
router.get("/me", protect, getCurrentUser);

router.get(
  "/",
  protect,
  rbac,
  getUsers
);

module.exports = router;
