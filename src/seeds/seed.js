// src/seeds/seed.js
import dotenv from "dotenv";
dotenv.config();

import { knex } from "../config/db.js";
import { Model } from "objection";
import Role from "../models/role.js";
import Permission from "../models/permission.js";
import User from "../models/user.js";

async function seed() {
  try {
    // Bind all models to knex
    Model.knex(knex);
    console.log("Knex & Objection configured");

    // Clear tables in order (important: foreign keys)
    await knex("user_roles").del();
    await knex("role_permissions").del();
    await knex("users").del();
    await knex("roles").del();
    await knex("permissions").del();

    // Insert permissions
    const viewUser = await Permission.query().insert({ name: "view_user" });
    const createUser = await Permission.query().insert({ name: "create_user" });
    const deleteUser = await Permission.query().insert({ name: "delete_user" });

    // Insert roles
    const adminRole = await Role.query().insert({ name: "Admin" });
    const userRole = await Role.query().insert({ name: "User" });

    // Link permissions to roles
    await knex("role_permissions").insert([
      { roleId: adminRole.id, permissionId: viewUser.id },
      { roleId: adminRole.id, permissionId: createUser.id },
      { roleId: adminRole.id, permissionId: deleteUser.id },
      { roleId: userRole.id, permissionId: viewUser.id },
    ]);

    // Create admin user
    const adminUser = await User.query().insert({
      username: (process.env.ADMIN_NAME || "admin").toLowerCase().replace(/\s+/g, "_"),
      email: process.env.ADMIN_EMAIL || "admin@test.com",
      password: process.env.ADMIN_PASSWORD || "123456", // make sure you hash it
    });



    // Assign admin role
    await knex("user_roles").insert({ userId: adminUser.id, roleId: adminRole.id });

    console.log("Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();
