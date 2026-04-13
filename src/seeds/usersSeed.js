import bcrypt from "bcryptjs";
import { User, Role, UserRole } from "../models/index.js";

export async function seed(knex) {
  // Bind models to the passed knex instance
  User.knex(knex);
  Role.knex(knex);
  UserRole.knex(knex);

  // Hash password
  const password = await bcrypt.hash("Admin123!", 10);

  // Try inserting admin, fallback to existing
  let admin = await User.query()
  .insert({
    username: "admin",
    email: "admin@test.com",
    password,
  })
  .onConflict("email")
  .ignore();

  // Always fetch the admin to ensure we have the ID
  if (!admin || !admin.id) {
    admin = await User.query().findOne({ email: "admin@test.com" });
  }


  // Get admin role
  const adminRole = await Role.query().findOne({ name: "Admin" });

  // Assign admin role to user
  await UserRole.query()
    .insert({
      userId: admin.id,
      roleId: adminRole.id,
    })
    .onConflict(["userId", "roleId"])
    .ignore();

  console.log("Users seeded.");
}
