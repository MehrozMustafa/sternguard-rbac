// src/config/db.js
import knexConstructor from "knex";
import { Model } from "objection";
import dotenv from "dotenv";
dotenv.config();

// Initialize Knex
export const knex = knexConstructor({
  client: "pg",
  connection: {
    host: process.env.DB_HOST || "127.0.0.1",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "sternguard",
    port: process.env.DB_PORT || 5432,
  },
  pool: { min: 0, max: 10 },
});

// Bind Objection models to Knex
Model.knex(knex);

console.log("Knex & Objection configured");
