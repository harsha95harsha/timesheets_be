const express = require("express");
const router = express.Router();
const { verifyjwt } = require("../middlewares/verifyJWT");
const {
  getAllUserTasks,
  getTasksOfLoggedInUser,
  getUserProjectsOfLoggedInUser,
  createUserTask,
  getUserTaskById,
  updateUserTask,
  deleteUserTask,
} = require("../controllers/userTaskController");

router.get("/api/list/user_tasks", verifyjwt, getAllUserTasks);
router.get(
  "/api/list/logged_in_user/user_tasks",
  verifyjwt,
  getTasksOfLoggedInUser
);
router.get(
  "/api/list/logged_in_user/user_projects",
  verifyjwt,
  getUserProjectsOfLoggedInUser
);
router.post("/api/create/user_task", verifyjwt, createUserTask);
router.get("/api/list/user_task/:id", verifyjwt, getUserTaskById);
router.put("/api/modify/user_task/:id", verifyjwt, updateUserTask);
router.delete("/api/delete/user_task/:id", verifyjwt, deleteUserTask);

module.exports = router;
