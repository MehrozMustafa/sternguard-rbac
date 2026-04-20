import express from "express";
const router = express.Router();

import {
  createUser,
  loginUser,
  getUsers,
  getCurrentUser,
  deleteUser
} from "../controllers/userController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { rbac } from "../middlewares/rbacMiddleware.js";

// Public
router.post("/register", createUser);
router.post("/login", loginUser);

// Authenticated
router.get("/me", protect, getCurrentUser);

// Admin (RBAC controlled)
router.get("/", protect, rbac(), getUsers);
router.post("/", protect, rbac(), createUser);
router.delete("/:id", protect, rbac(), deleteUser);

export default router;
