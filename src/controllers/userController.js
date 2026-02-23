const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, Role } = require("../models");

const generateToken = (user) =>
  jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

// Register user
exports.createUser = async (req, res) => {
  const { username, email, password, roleId } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ error: "Email already in use" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Handle role
    try {
      // Check if role exists
      const role = await Role.findByPk(roleId);
      if (!role) return res.status(400).json({ error: "Invalid roleId" });

      const hashed = await bcrypt.hash(password, 10);

      // Create user with roleId
      const user = await User.create({ username, email, password: hashed, roleId });

      res.status(201).json({ message: "User created", user });
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        return res.status(400).json({
          error: error.errors.map((e) => e.message)
        });
      }
      console.error(error); // log full error for debugging
      res.status(500).json({ error: "Server error" });
    }

    if (roleId) {
      // Validate provided roleId
      role = await Role.findByPk(roleId);
      if (!role) return res.status(400).json({ error: "Invalid roleId" });
    } else {
      // Assign default role if none provided
      role = await Role.findOne({ where: { name: "user" } });
    }

    // Create user with proper roleId
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      roleId: role ? role.id : null
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: role ? role.name : null
      }
    });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: error.errors.map((e) => e.message)
      });
    }
    res.status(500).json({ error: "Server error" });
  }
};


// Login user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ error: "Email and password required" });

  try {
    const user = await User.findOne({ where: { email }, include: { model: Role, as: "role" } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid password" });

    const token = generateToken(user);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get all users (admin only)
// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: {
        model: Role,
        as: "role",
        required: false // important: allows users with no role
      }
    });
    res.json(users);
  } catch (err) {
    console.error(err); // log error for debugging
    res.status(500).json({ error: "Server error" });
  }
};


// Get current logged-in user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { include: { model: Role, as: "role" } });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
