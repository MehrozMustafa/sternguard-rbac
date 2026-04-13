import { RolePermission, Role, Permission } from "../models/index.js";

export async function seed(knex) {
  Role.knex(knex);
  Permission.knex(knex);
  RolePermission.knex(knex);

  const adminRole = await Role.query().findOne({ name: "Admin" });
  const userRole = await Role.query().findOne({ name: "User" });

  const permissions = await Permission.query();

  for (const perm of permissions) {
    await RolePermission.query()
      .insert({
        roleId: adminRole.id,
        permissionId: perm.id,
      })
      .onConflict(["roleId", "permissionId"])
      .ignore();
  }

  const viewUserPerm = permissions.find(p => p.name === "view_user");
  await RolePermission.query()
    .insert({
      roleId: userRole.id,
      permissionId: viewUserPerm.id,
    })
    .onConflict(["roleId", "permissionId"])
    .ignore();

  console.log("Role permissions seeded.");
}
