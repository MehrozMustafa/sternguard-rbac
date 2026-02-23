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

// const dotenv = require("dotenv");
// dotenv.config();

// const bcrypt = require("bcryptjs");

// const { sequelize, connectDB } = require("../src/config/db");
// const { User, Role, Permission } = require("../src/models");

// const seed = async () => {
//   try {
//     await connectDB();

//     // Reset tables
//     await sequelize.sync({ force: true });
//     console.log("Database synced!");

//     // --- CREATE ROLES ---
//     const adminRole = await Role.create({ name: "admin" });
//     const userRole = await Role.create({ name: "user" });

//     // --- CREATE PERMISSIONS ---
//     const permCreateUser = await Permission.create({ name: "create_user" });
//     const permDeleteUser = await Permission.create({ name: "delete_user" });
//     const permViewUser = await Permission.create({ name: "view_user" });

//     // --- ASSIGN PERMISSIONS TO ROLES ---
//     await adminRole.setPermissions([permCreateUser, permDeleteUser, permViewUser]);
//     await userRole.setPermissions([permViewUser]);

//     // --- CREATE SAMPLE USERS ---
//     const hashedPassword = await bcrypt.hash("password123", 10);

//     // Admin user
//     const adminUser = await User.create({
//       name: "Mehroz Mustafa",
//       email: "admin@example.com",
//       password: hashedPassword,
//     });
//     await adminUser.setRoles([adminRole]);

//     // Regular user
//     const regularUser = await User.create({
//       name: "Regular User",
//       email: "user@example.com",
//       password: hashedPassword,
//     });
//     await regularUser.setRoles([userRole]);

//     console.log("Seeding completed successfully!");
//     process.exit(0);
//   } catch (err) {
//     console.error("Seeding error:", err);
//     process.exit(1);
//   }
// };

// seed();
