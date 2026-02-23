const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const { connectDB, sequelize } = require("./config/db");
const userRoutes = require("./routes/userRoutes");

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

// Connect to DB
connectDB();

// Sync Sequelize models (optional: { force: true } to reset tables)
sequelize.sync({ alter: true }).then(() => {
  console.log("Database synced with Sequelize models");
});

module.exports = app;
