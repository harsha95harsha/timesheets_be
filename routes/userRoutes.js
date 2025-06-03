const express = require("express");
const router = express.Router();
const { verifyjwt } = require("../middlewares/verifyJWT");
const { requirePermission } = require("../middleware/authMiddleware");
const {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getLoggedInUserSno,
} = require("../controllers/userController");

// Protected routes with RBAC
router.use(verifyjwt);

// User listing - requires view_user permission
router.get("/api/list/users", requirePermission("view_user"), getAllUsers);

// Get logged in user's info - available to all authenticated users
router.get("/api/list/logged-in-user_sno", getLoggedInUserSno);

// User management routes with permission checks
router.post("/api/create/user", requirePermission("create_user"), createUser);

router.get("/api/list/user/:id", requirePermission("view_user"), getUserById);

router.put("/api/modify/user/:id", requirePermission("edit_user"), updateUser);

router.delete(
  "/api/delete/user/:id",
  requirePermission("delete_user"),
  deleteUser
);

module.exports = router;
