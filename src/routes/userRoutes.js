const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const rbac = require("../middlewares/rbacMiddleware");
const {
  login,
  getProtected,
  createUser,
  getUsers,
  updateUser,
  deleteUser
} = require("../controllers/userController");

// Auth
router.post("/login", login);

// Example protected route
router.get("/get", auth, rbac("read:any_user"), getProtected);

// User CRUD
router.post("/users", auth, rbac("create:any_user"), createUser);
router.get("/users", auth, rbac("read:any_user"), getUsers);
router.put("/users/:id", auth, rbac("update:any_user"), updateUser);
router.delete("/users/:id", auth, rbac("delete:any_user"), deleteUser);

module.exports = router;


// const express = require("express");
// const router = express.Router();
// const { createUser, loginUser, getUsers, getCurrentUser } = require("../controllers/userController");
// const { protect } = require("../middlewares/authMiddleware");
// const rbac = require("../middlewares/rbacMiddleware");

// // Public
// router.post("/register", createUser);
// router.post("/login", loginUser);

// // Protected
// router.get("/", protect, rbac({ roles: ["admin"], permissions: ["view_user"] }), getUsers);
// router.get("/me", protect, getCurrentUser);

// module.exports = router;

