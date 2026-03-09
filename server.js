// server.js
import express from "express";
import dotenv from "dotenv";
dotenv.config();

import { knex } from "./src/config/db.js";  // <-- only knex, no connectDB
import userRoutes from "./src/routes/userRoutes.js";

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

// Optional: test the connection
knex.raw("SELECT 1")
  .then(() => console.log("PostgreSQL connected via Knex"))
  .catch(err => console.error("DB connection error:", err));


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

export default app;
