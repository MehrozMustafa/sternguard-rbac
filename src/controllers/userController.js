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
