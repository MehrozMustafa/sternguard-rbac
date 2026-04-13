import { Role } from "../models/role.js";

export async function seed(knex) {
  Role.knex(knex);

  const roles = ["Admin", "User"];
  for (const name of roles) {
    await Role.query().insert({ name }).onConflict("name").ignore();
  }
  console.log("Roles seeded.");
}
