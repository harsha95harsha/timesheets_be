const express = require("express");
const router = express.Router();
const { verifyjwt } = require("../middlewares/verifyJWT");

const {
  editUserProfile,
  editSuperAdminProfile,

  changePassword,
  fetchLoggedInUser,
} = require("../controllers/profileController");

router.put("/api/profile/:id", verifyjwt, editUserProfile);
router.put("/api/superadmin/profile/:id", verifyjwt, editSuperAdminProfile);
router.get("/api/fetch/user", verifyjwt, fetchLoggedInUser);
router.put("/api/changepassword", verifyjwt, changePassword);

module.exports = router;
