import { knex } from "../config/db.js";
import { Model } from "objection";

// import seeds dynamically
import * as permissionsSeed from "./permissionsSeed.js";
import * as rolesSeed from "./rolesSeed.js";
import * as rolePermissionsSeed from "./rolePermissionsSeed.js";
import * as usersSeed from "./usersSeed.js";
import { seedRoutePermissions } from "./routePermissionsSeed.js";

async function seedAll() {
  // bind SINGLE knex instance
  Model.knex(knex);

  try {
    await permissionsSeed.seed(knex);
    await rolesSeed.seed(knex);
    await rolePermissionsSeed.seed(knex);
    await usersSeed.seed(knex);
    await seedRoutePermissions(knex);
  } catch (err) {
    console.error("Seeding failed:", err);
  } finally {
    await knex.destroy();
  }
}

seedAll();
