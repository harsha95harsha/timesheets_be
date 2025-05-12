const express = require("express");
const router = express.Router();
const {
  login,

  refreshToken,
} = require("../controllers/authController");
const {
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");

router.post("/api/login", login);

router.post("/api/refresh-token", refreshToken);
router.post("/api/forgot-password", forgotPassword);
router.post("/api/reset-password", resetPassword);

module.exports = router;
