// src/seeds/seed.js
import Knex from "knex";
import { Model } from "objection";
import knexConfig from "../config/knexfile.cjs";

// import seeds dynamically
import * as permissionsSeed from "./permissionsSeed.js";
import * as rolesSeed from "./rolesSeed.js";
import * as rolePermissionsSeed from "./rolePermissionsSeed.js";
import * as usersSeed from "./usersSeed.js";

async function seedAll() {
  const knex = Knex(knexConfig.development);
  Model.knex(knex);

  try {
    await permissionsSeed.seed(knex);
    await rolesSeed.seed(knex);
    await rolePermissionsSeed.seed(knex);
    await usersSeed.seed(knex);
  } catch (err) {
    console.error("Seeding failed:", err);
  } finally {
    await knex.destroy();
  }
}

seedAll();
