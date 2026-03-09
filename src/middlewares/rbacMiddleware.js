const { User } = require("../models");
 // or require("../models/user") depending on your structure

const methodPermissionMap = {
  GET: "view",
  POST: "create",
  PUT: "update",
  PATCH: "update",
  DELETE: "delete",
};

const rbac = async (req, res, next) => {
  try {
    const user = await User.query()
      .findById(req.user.id)
      .withGraphFetched("role.permissions");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Example: /api/users -> users -> user
    const entity = req.baseUrl.split("/").pop().slice(0, -1);

    const action = methodPermissionMap[req.method];

    const requiredPermission = `${action}_${entity}`;

    const userPermissions = user.role.permissions.map(p => p.name);

    if (!userPermissions.includes(requiredPermission)) {
      return res.status(403).json({
        message: "Forbidden",
        requiredPermission,
      });
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "RBAC check failed" });
  }
};

module.exports = rbac;
