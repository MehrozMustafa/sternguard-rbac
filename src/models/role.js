const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Permission = require("./permission");

const Role = sequelize.define("Role", {
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
});

Role.belongsToMany(Permission, {
  through: "RolePermissions",
  as: "permissions",
  foreignKey: "roleId",
  otherKey: "permissionId"
});


module.exports = Role;
