export const rbac = (requiredPermission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 🔥 Extract roles and permissions clearly
    const roleDetails = req.user.roles.map(role => ({
      role: role.name,
      permissions: role.permissions.map(p => p.name)
    }));

    const permissions = roleDetails.flatMap(r => r.permissions);

    // 🔍 DEBUG LOGS (VERY IMPORTANT)
    console.log("========== RBAC DEBUG ==========");
    console.log("User:", req.user.email);
    console.log("Roles:", roleDetails);
    console.log("Flattened Permissions:", permissions);
    console.log("Required Permission:", requiredPermission);
    console.log("================================");

    if (!requiredPermission) return next();

    if (!permissions.includes(requiredPermission)) {
      return res.status(403).json({
        message: "Forbidden: insufficient permissions",
        required: requiredPermission,
        userPermissions: permissions,
        roles: roleDetails
      });
    }

    next();
  };
};
