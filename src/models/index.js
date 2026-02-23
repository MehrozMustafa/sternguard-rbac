const User = require("./user");
const Role = require("./role");
const Permission = require("./permission");

// Many-to-many for Role-Permission
Role.belongsToMany(Permission, { through: "RolePermissions", foreignKey: "roleId" });
Permission.belongsToMany(Role, { through: "RolePermissions", foreignKey: "permissionId" });

module.exports = { User, Role, Permission };
