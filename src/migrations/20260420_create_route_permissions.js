export async function up(knex) {
  await knex.schema.createTable("route_permissions", (table) => {
    table.increments("id").primary();
    table.string("method").notNullable();
    table.string("route").notNullable();
    table.string("permission").notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("route_permissions");
}

exports.up = async function (knex) {
  await knex.schema.alterTable("route_permissions", (table) => {
    table.string("permission").nullable().alter();
  });
};

exports.down = async function (knex) {
  await knex.schema.alterTable("route_permissions", (table) => {
    table.string("permission").notNullable().alter();
  });
};

/** 
 * exports.up = async function (knex) {
  await knex.raw(`
    ALTER TABLE route_permissions
    ALTER COLUMN permission DROP NOT NULL;
  `);
};

exports.down = async function (knex) {
  await knex.raw(`
    ALTER TABLE route_permissions
    ALTER COLUMN permission SET NOT NULL;
  `);
};
 */