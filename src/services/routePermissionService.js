import { RoutePermission } from "../models/routePermission.js";
import { refreshRoutePermissions } from "../cache/routePermissionCache.js";

export const createRoutePermission = async (data) => {
  const result = await RoutePermission.query().insert(data);

  await refreshRoutePermissions();

  return result;
};

export const deleteRoutePermission = async (id) => {
  const result = await RoutePermission.query().deleteById(id);

  await refreshRoutePermissions();

  return result;
};
