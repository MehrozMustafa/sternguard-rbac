import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import { Role } from "../models/role.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

/**
 * Create a new user
 */
export const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.query().findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.query().insert({
      username,
      email,
      password: hashedPassword,
    });

    // Assign default role
    const role = await Role.query().findOne({ name: "User" });

    if (role) {
      await user.$relatedQuery("roles").relate(role.id);
    }

    const safeUser = { ...user };
    delete safeUser.password;

    return res.status(201).json({
      message: "User created",
      user: safeUser,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Login user
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.query().findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get current logged-in user
 */
export const getCurrentUser = async (req, res) => {
  try {
    return res.json(req.user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get all users
 */
export const getUsers = async (req, res) => {
  try {
    const users = await User.query().withGraphFetched("roles.permissions");

    const safeUsers = users.map((u) => {
      const user = { ...u };
      delete user.password;
      return user;
    });

    return res.json(safeUsers);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Delete user
 */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.query().findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.query().deleteById(id);

    const safeUser = { ...user };
    delete safeUser.password;

    return res.json({
      message: "User deleted successfully",
      deletedUser: safeUser,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
