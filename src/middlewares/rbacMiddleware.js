const { User, Role, Permission } = require("../models");

const rbac = ({ permissions = [] }) => async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: {
        model: Role,
        as: "role",
        include: {
          model: Permission,
          as: "Permissions"
        }
      }
    });

    if (!user || !user.role)
      return res.status(403).json({ error: "Access denied" });

    if (permissions.length > 0) {
      const userPermissions = user.role.Permissions.map(p => p.name);

      const hasPermission = permissions.every(p =>
        userPermissions.includes(p)
      );

      if (!hasPermission)
        return res.status(403).json({
          error: "Access denied: insufficient permissions"
        });
    }

    next();

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = rbac;
