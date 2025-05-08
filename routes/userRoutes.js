const express = require("express");
const router = express.Router();
const { verifyjwt } = require("../middlewares/verifyJWT");
const {
  getAllUsers,
  getLoggedInUserSno,
  createSuperAdmin,
  isSuperAdmin,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { route } = require("./statusApiRoutes");

router.get("/api/list/users", verifyjwt, getAllUsers);
router.get("/api/list/logged_in_user_sno", verifyjwt, getLoggedInUserSno);
router.get("/api/check/is_super_admin", verifyjwt, isSuperAdmin);
router.post("/api/create/super-admin", createSuperAdmin);
// router.patch("/api/modify/super-admin", verifyjwt, resetSuperAdminPassword);
router.post("/api/create/user", verifyjwt, createUser);
router.get("/api/list/user/:id", verifyjwt, getUserById);
router.put("/api/modify/user/:id", verifyjwt, updateUser);
router.delete("/api/delete/user/:id", verifyjwt, deleteUser);

module.exports = router;
