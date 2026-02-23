const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }]
});

module.exports = mongoose.model('User', userSchema);


// const { DataTypes } = require("sequelize");
// const sequelize = require("../config/db");
// const Role = require("./role");

// const User = sequelize.define("User", {
//   username: { type: DataTypes.STRING, allowNull: false },
//   email: { type: DataTypes.STRING, allowNull: false, unique: true },
//   password: { type: DataTypes.STRING, allowNull: false },
// });

// // Association: a User has one Role
// User.belongsTo(Role, { foreignKey: "roleId", as: "role" });

// module.exports = User;

