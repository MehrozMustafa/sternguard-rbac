import { Permission } from "../models/permission.js";

export async function seed(knex) {
  // Bind Objection models to this knex instance
  Permission.knex(knex);

  const perms = ["view_user", "create_user", "update_user", "delete_user"];
  for (const name of perms) {
    await Permission.query().insert({ name }).onConflict("name").ignore();
  }
  console.log("Permissions seeded.");
}
