import express from "express";
import dotenv from "dotenv";
dotenv.config();

import userRoutes from "./routes/userRoutes.js";
import { connectDB } from "./config/db.js";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", userRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Sternguard RBAC API is running!");
});

// Connect to PostgreSQL via Knex
connectDB()
  .then(() => {
    console.log("PostgreSQL connected via Knex/Objection");
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });

export default app;
