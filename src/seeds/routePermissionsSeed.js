import { RoutePermission } from "../models/routePermission.js";

let cache = [];

// Load from DB into memory
export const loadRoutePermissions = async () => {
  const rows = await RoutePermission.query();

  // normalize into key-based map for fast lookup
  cache = rows.map((r) => ({
    key: `${r.method.toUpperCase()}::${r.route}`,
    permission: r.permission,
  }));

  console.log(`Route permissions loaded: ${cache.length}`);
};

// Get permission by routeKey
export const getRoutePermission = (routeKey) => {
  return cache.find((p) => p.key === routeKey);
};

// refresh wrapper
export const refreshRoutePermissions = async () => {
  await loadRoutePermissions();
};

export const seedRoutePermissions = async (knex) => {
  return knex("route_permissions").insert([
    {
      method: "GET",
      route: "/api/users",
      permission: "view_user",
    },
    {
      method: "GET",
      route: "/api/users/me",
      permission: "view_user",
    },
    {
      method: "POST",
      route: "/api/users",
      permission: "create_user",
    },
    {
      method: "DELETE",
      route: "/api/users/:id",
      permission: "delete_user",
    },
  ]);
};
