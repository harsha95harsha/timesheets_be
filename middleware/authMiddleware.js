const jwt = require("jsonwebtoken");
const { checkUserPermission } = require("../utils/permissionUtils");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access token is required",
    });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
    req.user = user;
    next();
  });
};

const requirePermission = (permission) => {
  return async (req, res, next) => {
    try {
      const hasPermission = await checkUserPermission(req.user, permission);

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to perform this action",
        });
      }

      next();
    } catch (error) {
      console.error("Permission check error:", error);
      res.status(500).json({
        success: false,
        message: "Error checking permissions",
      });
    }
  };
};

module.exports = {
  authenticateToken,
  requirePermission,
};
