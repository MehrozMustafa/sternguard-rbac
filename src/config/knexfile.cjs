// src/config/knexfile.cjs
require("dotenv").config();
const path = require("path");

module.exports = {
  development: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST || "127.0.0.1",
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "0310",
      database: process.env.DB_NAME || "sternguard",
      port: process.env.DB_PORT || 5432,
    },
    migrations: {
      directory: path.resolve(__dirname, "../migrations"), // correct path
    },
    seeds: {
      directory: path.resolve(__dirname, "../seeds"), // correct path
    },
  },
};
