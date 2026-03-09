// src/db/seeds/01_initial_roles_permissions.js

exports.seed = async function (knex) {
  // Clear tables first (optional, useful for dev)
  await knex('RolePermissions').del();
  await knex('Permissions').del();
  await knex('Roles').del();

  // Insert roles
  const roles = await knex('Roles').insert([
    { name: 'admin', createdAt: new Date(), updatedAt: new Date() },
    { name: 'manager', createdAt: new Date(), updatedAt: new Date() },
    { name: 'user', createdAt: new Date(), updatedAt: new Date() },
  ]).returning('*');

  // Insert permissions
  const permissions = await knex('Permissions').insert([
    { name: 'create_user', createdAt: new Date(), updatedAt: new Date() },
    { name: 'view_user', createdAt: new Date(), updatedAt: new Date() },
    { name: 'update_user', createdAt: new Date(), updatedAt: new Date() },
    { name: 'delete_user', createdAt: new Date(), updatedAt: new Date() },
  ]).returning('*');

  // Link admin role with all permissions
  const adminRole = roles.find(r => r.name === 'admin');
  const adminPermissions = permissions.map(p => ({
    roleId: adminRole.id,
    permissionId: p.id,
    createdAt: new Date(),
    updatedAt: new Date()
  }));
  await knex('RolePermissions').insert(adminPermissions);
};
