module.exports = ({ roles = [], permissions = [] }) => async (req, res, next) => {
  const userRole = req.user?.role;
  if (!userRole) return res.status(403).json({ error: "Access denied" });

  // Role check
  if (roles.length && !roles.includes(userRole.name)) return res.status(403).json({ error: "Role denied" });

  // Permission check
  if (permissions.length) {
    const rolePermissions = await userRole.getPermissions();
    const hasPermission = permissions.every((perm) => rolePermissions.map((p) => p.name).includes(perm));
    if (!hasPermission) return res.status(403).json({ error: "Permission denied" });
  }

  next();
};
