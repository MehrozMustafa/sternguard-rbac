export const getRouteKey = (req) => {
  const method = req.method;

  let route = req.route?.path || "";

  // fallback safety
  const baseUrl = req.baseUrl || "";

  const fullRoute = `${baseUrl}${route}`;

  return normalizeRouteKey(`${method}:${fullRoute}`);
};

const normalizeRouteKey = (key) => {
  return key
    .split("?")[0]
    .replace(/\/+$/, "")
    .replace(/\/\d+/g, "/:id");
};
