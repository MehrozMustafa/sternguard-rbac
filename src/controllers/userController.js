const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, Role, Permission } = require("../models");

// Helper: generate JWT token
const generateToken = (user) =>
  jwt.sign(
    { id: user.id, role: user.role.name }, // include role in token
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
  );

// ------------------------
// Register new user
// ------------------------
exports.createUser = async (req, res) => {
  const { username, email, password, roleId } = req.body;

  // Basic input validation
  if (!username || !email || !password) {
    return res.status(400).json({ error: "Username, email, and password are required" });
  }

  try {
    // Check for existing user
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ error: "Email already in use" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({ username, email, password: hashedPassword, roleId });

    // Include role info
    const createdUser = await User.findByPk(user.id, { include: { model: Role, as: "role" } });

    res.status(201).json({ message: "User created", user: createdUser });
  } catch (error) {
    console.error("Create user error:", error);
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: error.errors.map((e) => e.message)
      });
    }
    res.status(500).json({ error: "Server error" });
  }
};

// ------------------------
// Login user
// ------------------------
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required" });

  try {
    const user = await User.findOne({
      where: { email },
      include: { model: Role, as: "role", include: { model: Permission, as: "permissions" } },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid password" });

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role.name,
        permissions: user.role.permissions.map((p) => p.name)
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ------------------------
// Get all users (admin only)
// ------------------------
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: { model: Role, as: "role", include: { model: Permission, as: "permissions" } },
    });
    res.json(users);
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ------------------------
// Get current authenticated user
// ------------------------
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: { model: Role, as: "role", include: { model: Permission, as: "permissions" } },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role.name,
      permissions: user.role.permissions.map((p) => p.name),
    });
  } catch (err) {
    console.error("Get current user error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
