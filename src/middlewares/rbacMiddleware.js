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

module.exports = rbacMiddleware;
