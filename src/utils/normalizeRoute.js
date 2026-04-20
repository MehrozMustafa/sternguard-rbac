export const normalizeRoute = (route) => {
  if (!route) return "";

  return route
    .split("?")[0]               // remove query params
    .replace(/\/+$/, "")        // remove trailing slash
    .replace(/\/\d+/g, "/:id"); // convert numeric params to :id
};
