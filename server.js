const express = require("express");
const dotenv = require("dotenv");
const { Model } = require("objection");
const Knex = require("knex");

dotenv.config();

const userRoutes = require("./src/routes/userRoutes");

const app = express();
app.use(express.json());

const knex = Knex({
  client: "pg",
  connection: process.env.DATABASE_URL,
});

Model.knex(knex);

app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("PostgreSQL connected");
  console.log(`Server running on port ${PORT}`);
});
