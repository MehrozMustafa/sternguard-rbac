// RBAC middleware: checks if user has required roles or permissions
module.exports = ({ roles = [], permissions = [] }) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user) return res.status(401).json({ error: "Not authenticated" });

    // Check roles
    if (roles.length && !roles.includes(user.role)) {
      return res.status(403).json({ error: "Access denied: insufficient role" });
    }

    // Check permissions
    if (permissions.length) {
      const hasPermission = permissions.every((perm) =>
        user.permissions?.includes(perm)
      );
      if (!hasPermission) {
        return res.status(403).json({ error: "Access denied: insufficient permission" });
      }
    }

    next();
  };
};
