import { RoutePermission } from "../models/routePermission.js";

let cache = new Map();

export const loadRoutePermissions = async () => {
  const rows = await RoutePermission.query();

  cache.clear();

  for (const r of rows) {
    const key = `${r.method}:${r.route}`;
    cache.set(key, r);
  }

  console.log(`Route permissions loaded: ${cache.size}`);
};

export const getRoutePermission = (routeKey) => {
  return cache.get(routeKey);
};

export const refreshRoutePermissions = async () => {
  await loadRoutePermissions();
};
