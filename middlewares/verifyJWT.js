const jwt = require("jsonwebtoken");
const secretKey = process.env.ACCESS_TOKEN_SECRET;

// Middleware function to verify JWT token
const verifyjwt = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  console.log("token", token);

  if (!token) {
    return res
      .status(401)
      .json({ statusCode: 401, error: "Token not provided" });
  }
  try {
    const decodedAccessToken = jwt.verify(token, "secret");
    console.log(decodedAccessToken);
    req.user = decodedAccessToken;
    next();
  } catch (error) {
    console.error("JWT Error:", error.message);
    return res.status(403).json({
      statusCode: 403,
      error: "Failed to authenticate token",
      message: error.message
    });
  }
};

module.exports = {
  verifyjwt
};
