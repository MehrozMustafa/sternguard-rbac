import jwt from "jsonwebtoken";
import { User } from "../models/user.js"; // ✅ named import

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// 1️⃣ Protect routes: ensure user is logged in
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(401).json({ message: "Unauthorized" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    // Fetch user with roles and permissions
    const user = await User.query()
      .findById(decoded.userId)
      .withGraphFetched("roles.permissions");

    if (!user) return res.status(401).json({ message: "Unauthorized" });

    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

// 2️⃣ Authorize: check if user has a specific permission
export const authorize = (permissionName) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    // Flatten all permissions from roles
    const permissions = req.user.roles
      .flatMap(role => role.permissions)
      .map(p => p.name);

    if (!permissions.includes(permissionName)) {
      return res.status(403).json({ message: "Forbidden: insufficient permissions" });
    }

    next();
  };
};
