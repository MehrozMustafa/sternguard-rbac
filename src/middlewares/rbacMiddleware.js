// Automatically checks user permissions based on roles
export const rbac = () => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    // Flatten all permissions from user's roles
    const userPermissions = req.user.roles.flatMap(role => role.permissions.map(p => p.name));

    // Example: Allow all for now; later you can add specific permission logic
    // To restrict certain routes, check: if (!userPermissions.includes("view_user")) return res.status(403)
    req.user.permissions = userPermissions;
    next();
  };
};
