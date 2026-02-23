const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Role = require("../models/role");
const Permission = require("../models/permission");

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).populate({
    path: "roles",
    populate: { path: "permissions" }
  });

  if (!user) return res.status(400).json({ message: "User not found" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: "Invalid password" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

  res.json({ token });
};

// Protected example route
exports.getProtected = (req, res) => {
  res.json({ message: "Hello Mehroz", user: req.user });
};

// Full CRUD skeleton
exports.createUser = async (req, res) => {
  const { name, email, password, roles } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed, roles });
  res.json(user);
};

exports.getUsers = async (req, res) => {
  const users = await User.find().populate({ path: "roles", populate: { path: "permissions" } });
  res.json(users);
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, roles } = req.body;
  const user = await User.findByIdAndUpdate(id, { name, email, roles }, { new: true });
  res.json(user);
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndDelete(id);
  res.json({ message: "User deleted" });
};


// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const { User, Role, Permission } = require("../models");

// const generateToken = (user) =>
//   jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

// // Register
// exports.createUser = async (req, res) => {
//   const { username, email, password, roleId } = req.body;
//   try {
//     const hashed = await bcrypt.hash(password, 10);
//     const user = await User.create({ username, email, password: hashed, roleId });
//     res.status(201).json({ message: "User created", user });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// // Login
// exports.loginUser = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ where: { email }, include: { model: Role, as: "role" } });
//     if (!user) return res.status(404).json({ error: "User not found" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(401).json({ error: "Invalid password" });

//     const token = generateToken(user);
//     res.json({ token });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Get all users
// exports.getUsers = async (req, res) => {
//   try {
//     const users = await User.findAll({ include: { model: Role, as: "role" } });
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Get current user
// exports.getCurrentUser = async (req, res) => {
//   try {
//     const user = await User.findByPk(req.user.id, { include: { model: Role, as: "role" } });
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
