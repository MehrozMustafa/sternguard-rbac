const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
});

module.exports = mongoose.model('Permission', permissionSchema);

// const { DataTypes } = require("sequelize");
// const sequelize = require("../config/db");

// const Permission = sequelize.define("Permission", {
//   name: { type: DataTypes.STRING, allowNull: false, unique: true },
// });

// module.exports = Permission;

