import express from "express";
const router = express.Router();

import { ROUTES } from "../config/routes.js";
import { PERMISSIONS } from "../config/permissions.js";

import {
  createUser,
  loginUser,
  getUsers,
  getCurrentUser,
} from "../controllers/userController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { rbac } from "../middlewares/rbacMiddleware.js";


// Public routes
router.post(ROUTES.USER.REGISTER, createUser);
router.post(ROUTES.USER.LOGIN, loginUser);

// Protected routes
router.get(ROUTES.USER.ME, protect, getCurrentUser);

// Get all users (requires 'view_user' permission)
router.get(
  ROUTES.USER.LIST,
  protect,
  rbac(PERMISSIONS.USER.VIEW),
  getUsers
);

// Create a new user (requires 'create_user' permission)
router.post(
  ROUTES.USER.CREATE,
  protect,
  rbac(PERMISSIONS.USER.CREATE),
  createUser
);

// Delete a user (requires 'delete_user' permission)
router.delete(
  ROUTES.USER.DELETE,
  protect,
  rbac(PERMISSIONS.USER.DELETE),
  async (req, res) => {
    // Your delete logic here
    res.json({ message: "User deleted" });
  }
);

export default router;
