const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;

// const { Sequelize } = require("sequelize");
// require("dotenv").config();

// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST || "localhost",
//     dialect: "postgres",
//     logging: false,
//   }
// );

// sequelize
//   .authenticate()
//   .then(() => console.log("PostgreSQL connected"))
//   .catch((err) => console.error("PostgreSQL connection error:", err));

// module.exports = sequelize;
