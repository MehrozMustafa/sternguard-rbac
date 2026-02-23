const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Permission = require("./permission");

const Role = sequelize.define("Role", {
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
});

// Association: a Role has many Permissions
Role.belongsToMany(Permission, { through: "RolePermissions", foreignKey: "roleId" });

module.exports = Role;
