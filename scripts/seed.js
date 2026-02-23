const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("../src/models/user");
const Role = require("../src/models/role");
const Permission = require("../src/models/permission");
const connectDB = require("../src/config/db");

dotenv.config();

const seed = async () => {
  await connectDB();

  // Cleanup first
  await User.deleteMany();
  await Role.deleteMany();
  await Permission.deleteMany();

  // Permissions
  const readUsers = await Permission.create({ name: "read:any_user" });
  const createUsers = await Permission.create({ name: "create:any_user" });
  const updateUsers = await Permission.create({ name: "update:any_user" });
  const deleteUsers = await Permission.create({ name: "delete:any_user" });

  // Role
  const adminRole = await Role.create({
    name: "admin",
    permissions: [readUsers._id, createUsers._id, updateUsers._id, deleteUsers._id]
  });

  // Admin User
  const hashedPassword = await bcrypt.hash("123456", 10);
  const adminUser = await User.create({
    name: "Admin",
    email: "admin@test.com",
    password: hashedPassword,
    roles: [adminRole._id]
  });

  console.log("Seed completed:", {
    user: adminUser,
    role: adminRole
  });

  process.exit();
};

seed();
