const express = require("express");
const router = express.Router();
const { verifyjwt } = require("../middlewares/verifyJWT");

const {
  editUserProfile,
  changePassword,
  fetchLoggedInUser,
} = require("../controllers/profileController");

router.put("/api/profile/:id", verifyjwt, editUserProfile);
router.get("/api/fetch/user", verifyjwt, fetchLoggedInUser);
router.get("/api/logged-in-user", verifyjwt, fetchLoggedInUser);
router.put("/api/change-password", verifyjwt, changePassword);

module.exports = router;
