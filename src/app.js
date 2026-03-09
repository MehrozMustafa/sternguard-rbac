const express = require("express");
const dotenv = require("dotenv");
const Knex = require("knex");
const { Model } = require("objection");

dotenv.config();

const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const knex = Knex({
  client: "pg",
  connection: process.env.DATABASE_URL,
});

Model.knex(knex);

console.log("PostgreSQL connected");

app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Sternguard RBAC API is running!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
