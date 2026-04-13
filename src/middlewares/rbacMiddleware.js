export const rbac = (requiredPermission) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const permissions = req.user.roles
      .flatMap(role => role.permissions)
      .map(p => p.name);

    if (!requiredPermission) return next();

    if (!permissions.includes(requiredPermission)) {
      return res.status(403).json({ message: "Forbidden: insufficient permissions" });
    }

    next();
  };
};
