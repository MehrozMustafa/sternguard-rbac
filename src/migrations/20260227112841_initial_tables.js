// src/migrations/20260309120000_initial_tables.js
export async function up(knex) {
  // Users table
  await knex.schema.createTable("users", table => {
    table.increments("id").primary();
    table.string("username").notNullable().unique();
    table.string("email").notNullable().unique();
    table.string("password").notNullable();
    table.timestamps(true, true);
  });

  // Roles table
  await knex.schema.createTable("roles", table => {
    table.increments("id").primary();
    table.string("name").notNullable().unique();
    table.timestamps(true, true);
  });

  // Permissions table
  await knex.schema.createTable("permissions", table => {
    table.increments("id").primary();
    table.string("name").notNullable().unique();
    table.timestamps(true, true);
  });

  // Role-Permissions pivot table
  await knex.schema.createTable("role_permissions", table => {
    table.increments("id").primary();
    table.integer("roleId").unsigned().references("id").inTable("roles").onDelete("CASCADE");
    table.integer("permissionId").unsigned().references("id").inTable("permissions").onDelete("CASCADE");
  });

  // User-Roles pivot table
  await knex.schema.createTable("user_roles", table => {
    table.increments("id").primary();
    table.integer("userId").unsigned().references("id").inTable("users").onDelete("CASCADE");
    table.integer("roleId").unsigned().references("id").inTable("roles").onDelete("CASCADE");
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("user_roles");
  await knex.schema.dropTableIfExists("role_permissions");
  await knex.schema.dropTableIfExists("permissions");
  await knex.schema.dropTableIfExists("roles");
  await knex.schema.dropTableIfExists("users");
}
