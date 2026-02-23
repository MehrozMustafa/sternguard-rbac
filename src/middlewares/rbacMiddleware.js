// rbacMiddleware.js
const rbacMiddleware = (requiredPermission) => {
    return (req, res, next) => {
        // Make sure user is loaded and has roles
        if (!req.user || !req.user.roles) {
            return res.status(403).json({ message: "Forbidden: no roles assigned" });
        }

        // Collect all permissions from user's roles
        const userPermissions = [];
        req.user.roles.forEach(role => {
            if (role.permissions && role.permissions.length > 0) {
                role.permissions.forEach(p => {
                    if (typeof p === 'object' && p.name) {
                        userPermissions.push(p.name); // populated permission
                    } else if (typeof p === 'string') {
                        userPermissions.push(p); // id string if not populated
                    }
                });
            }
        });

        // Check if user has the required permission
        if (userPermissions.includes(requiredPermission)) {
            return next();
        } else {
            return res.status(403).json({ message: "Forbidden: insufficient permission" });
        }
    };
};

module.exports = (permissionName) => {
  return (req, res, next) => {
    if (!req.user || !req.user.roles) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const userPermissions = req.user.roles
      .flatMap(role => role.permissions || [])
      .map(p => p.name);

    if (!userPermissions.includes(permissionName)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};


// // RBAC middleware
// module.exports = ({ roles = [], permissions = [] }) => async (req, res, next) => {
//   const userRole = req.user?.role;
//   if (!userRole) return res.status(403).json({ error: "Access denied" });

//   // Role check
//   if (roles.length && !roles.includes(userRole.name)) return res.status(403).json({ error: "Role denied" });

//   // Permission check
//   if (permissions.length) {
//     const rolePermissions = await userRole.getPermissions();
//     const hasPermission = permissions.every((perm) => rolePermissions.map((p) => p.name).includes(perm));
//     if (!hasPermission) return res.status(403).json({ error: "Permission denied" });
//   }

//   next();
// };

