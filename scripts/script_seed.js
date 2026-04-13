import bcrypt from "bcryptjs";
import { knex } from "../config/db.js";
import { User, Role, Permission } from "../models/index.js";

export const seed = async () => {
  try {
    console.log("🌱 Seeding database...");

    // Clear existing data (order matters)
    await knex("user_roles").del();
    await knex("role_permissions").del();
    await knex("users").del();
    await knex("roles").del();
    await knex("permissions").del();

    // Reset sequences (Postgres)
    await knex.raw(`ALTER SEQUENCE users_id_seq RESTART WITH 1`);
    await knex.raw(`ALTER SEQUENCE roles_id_seq RESTART WITH 1`);
    await knex.raw(`ALTER SEQUENCE permissions_id_seq RESTART WITH 1`);

    // -------------------------
    // 🔥 Permissions
    // -------------------------
    const permissionsList = [
      // User
      "user:read",
      "user:create",
      "user:update",
      "user:delete",
      "user:activate",
      "user:assign-role",

      // Role
      "role:read",
      "role:create",
      "role:update",
      "role:delete",
      "role:assign",

      // Permission
      "permission:read",
      "permission:create",
      "permission:update",
      "permission:delete",
      "permission:assign",

      // System
      "system:admin",
      "system:audit",
      "system:settings",

      // Auth
      "auth:login",
      "auth:logout",
      "auth:refresh"
    ];

    const insertedPermissions = [];
    for (const name of permissionsList) {
      const p = await Permission.query().insert({ name });
      insertedPermissions.push(p);
    }

    // -------------------------
    // 🔥 Roles
    // -------------------------
    const adminRole = await Role.query().insert({ name: "Admin" });
    const userRole = await Role.query().insert({ name: "User" });

    // -------------------------
    // 🔥 Role ↔ Permissions
    // -------------------------

    // Admin → ALL permissions
    await knex("role_permissions").insert(
      insertedPermissions.map(p => ({
        role_id: adminRole.id,
        permission_id: p.id
      }))
    );

    // User → LIMITED permissions
    const userRead = insertedPermissions.find(p => p.name === "user:read");

    await knex("role_permissions").insert([
      {
        role_id: userRole.id,
        permission_id: userRead.id
      }
    ]);

    // -------------------------
    // 🔥 Admin User
    // -------------------------
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

    const adminUser = await User.query().insert({
      username: "admin",
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword
    });

    // Assign admin role
    await knex("user_roles").insert({
      user_id: adminUser.id,
      role_id: adminRole.id
    });

    console.log("✅ Seeding completed successfully!");
  } catch (err) {
    console.error("❌ Seed error:", err);
  }
};
