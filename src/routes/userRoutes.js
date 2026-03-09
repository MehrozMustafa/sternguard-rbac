import express from "express";
const router = express.Router();

import {
  createUser,
  loginUser,
  getUsers,
  getCurrentUser,
} from "../controllers/userController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { rbac } from "../middlewares/rbacMiddleware.js";

// Public routes
router.post("/register", createUser);
router.post("/login", loginUser);

// Protected routes
router.get("/me", protect, getCurrentUser);

// Get all users (auto RBAC, no manual permissions required)
router.get("/", protect, rbac(), getUsers);

export default router;
