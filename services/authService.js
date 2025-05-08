const jwt = require("jsonwebtoken");
const secretKey = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

console.log("secretKey", secretKey);
const generateToken = (user) => {
  const accessToken = jwt.sign(
    {
      user_sno: user.user_sno,
      user_name: user.user_name,
      user_email: user.user_email,
      is_super_admin: user.is_super_admin
    },
    secretKey,
    {
      expiresIn: "1d"
    }
  );
  console.log("accessToken", accessToken);
  const refreshToken = jwt.sign(
    {
      user_sno: user.user_sno,
      user_name: user.user_name,
      user_email: user.user_email,
      is_super_admin: user.is_super_admin
    },
    refreshTokenSecret,
    { expiresIn: "1d" }
  );
  return { accessToken, refreshToken };
};

const refreshAccessToken = (refreshToken) => {
  try {
    const decodedRefreshToken = jwt.verify(refreshToken, refreshTokenSecret);
    const user = {
      user_sno: decodedRefreshToken.user_sno,
      user_name: decodedRefreshToken.user_name,
      user_email: decodedRefreshToken.user_email,
      is_super_admin: decodedRefreshToken.is_super_admin
    };
    const accessToken = jwt.sign(user, secretKey, { expiresIn: "7d" });
    return accessToken;
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
};

module.exports = {
  generateToken,
  refreshAccessToken
};
