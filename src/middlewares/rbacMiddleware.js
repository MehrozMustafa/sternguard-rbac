import { getRoutePermission } from "../cache/routePermissionCache.js";
import { getRouteKey } from "../utils/getRouteKey.js";

export const rbac = () => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const routeKey = getRouteKey(req);

      const routePerm = getRoutePermission(routeKey);

      if (!routePerm) {
        return res.status(403).json({
          message: "No permission mapped for this route",
          routeKey,
        });
      }

      const userPermissions = req.user.roles
        .flatMap((role) => role.permissions)
        .map((p) => p.name);

      if (!userPermissions.includes(routePerm.permission)) {
        return res.status(403).json({
          message: "Forbidden",
          required: routePerm.permission,
        });
      }

      next();
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "RBAC error" });
    }
  };
};
