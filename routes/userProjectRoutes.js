const express = require("express");
const router = express.Router();
const { verifyjwt } = require("../middlewares/verifyJWT");
const {
  getAllUserProjects,
  createUserProject,
  getUserProjectById,
  getUserProjectsByUserSno,
  getUserProjectsByProjectSno,
  findProjectsOfLoggedInUser,
  updateUserProject,
  deleteUserProject,
} = require("../controllers/userProjectController");

router.get("/api/list/user_projects", verifyjwt, getAllUserProjects);
router.post("/api/create/user_project", verifyjwt, createUserProject);
router.get("/api/list/user_project/:id", verifyjwt, getUserProjectById);
router.get("/api/list/user_projects/:id", verifyjwt, getUserProjectsByUserSno);
router.get(
  "/api/list/user_project/:id",
  verifyjwt,
  getUserProjectsByProjectSno
);
router.get(
  "/api/list/logged_in_user/projects",
  verifyjwt,
  findProjectsOfLoggedInUser
);
router.put("/api/modify/user_project/:id", verifyjwt, updateUserProject);
router.delete("/api/delete/user_project/:id", verifyjwt, deleteUserProject);

module.exports = router;
