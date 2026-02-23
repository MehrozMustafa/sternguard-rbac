const { User, Role, Permission } = require("../models");

const rbac = ({ roles = [], permissions = [] }) => async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: {
        model: Role,
        as: "role",               // must match User.belongsTo(Role, {as: "role"})
        include: {
          model: Permission,
          as: "permissions"       // must match Role.belongsToMany(Permission, {as: "permissions"})
        }
      }
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    // Check role
    if (roles.length && (!user.role || !roles.includes(user.role.name))) {
      return res.status(403).json({ error: "Access denied: insufficient role" });
    }

    // Check permissions
    if (permissions.length) {
      if (!user.role || !user.role.permissions) {
        return res.status(403).json({ error: "Access denied: insufficient permissions" });
      }

      const userPermissions = user.role.permissions.map((p) => p.name);
      const hasPermission = permissions.every((p) => userPermissions.includes(p));
      if (!hasPermission) return res.status(403).json({ error: "Access denied: insufficient permissions" });
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = rbac;
