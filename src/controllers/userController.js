import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Role from "../models/role.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Create a new user
export const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.query().insert({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({ message: "User created", user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // userController.js login
    const user = await User.query().findOne({ email: req.body.email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
      
    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1d" });
    return res.json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get current logged-in user
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.query().findById(req.user.id).withGraphFetched("roles.permissions");
    return res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.query().withGraphFetched("roles.permissions");
    return res.json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
