const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const sequelize = require("./src/config/db");
const userRoutes = require("./src/routes/userRoutes");

const app = express();
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);

// Sync DB & start server
sequelize.sync({ alter: true }).then(() => {
  console.log("Database synced");
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
