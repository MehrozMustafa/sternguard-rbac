const jwt = require("jsonwebtoken");
const { User, Role, Permission } = require("../models");

exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) return res.status(401).json({ error: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findByPk(decoded.id, { include: { model: Role, as: "role" } });
    if (!req.user) return res.status(404).json({ error: "User not found" });
    next();
  } catch (err) {
    res.status(401).json({ error: "Token invalid" });
  }
};
