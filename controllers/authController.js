const bcrypt = require("bcrypt");
const userService = require("../services/userService");
const authService = require("../services/authService");

async function login(req, res) {
  const { user_email, password } = req.body;
  try {
    const user = await userService.findUserByEmail(user_email);

    if (!user) {
      return res
        .status(404)
        .json({ statusCode: 404, error: "User does not exist" });
    }

    if (user.user_status === "INACTIVE") {
      return res
        .status(401)
        .json({ statusCode: 401, error: "User is inactive and cannot log in" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log("the password sent in request is :", password);
    console.log("the stored password of the user: ", user.password);
    // console.log(password);
    // console.log(user.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ statusCode: 401, error: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = authService.generateToken(user);
    console.log(accessToken);
    res.status(200).json({ success: true, accessToken, refreshToken });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ statusCode: 500, error: "Internal server error" });
  }
}

async function refreshToken(req, res) {
  const { refreshToken } = req.body;
  try {
    const accessToken = authService.refreshAccessToken(refreshToken);
    res.status(200).json({ success: true, accessToken });
  } catch (error) {
    console.error("Error refreshing token:", error);
    res.status(401).json({ statusCode: 401, error: "Invalid refresh token" });
  }
}

module.exports = {
  login,

  refreshToken,
};
