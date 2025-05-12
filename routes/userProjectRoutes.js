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

router.get("/api/list/user-projects", verifyjwt, getAllUserProjects);
router.post("/api/create/user-project", verifyjwt, createUserProject);
router.get("/api/list/user-project/:id", verifyjwt, getUserProjectById);
router.get("/api/list/user-projects/:id", verifyjwt, getUserProjectsByUserSno);
router.get(
  "/api/list/user-project/:id",
  verifyjwt,
  getUserProjectsByProjectSno
);
router.get(
  "/api/list/logged-in-user/projects",
  verifyjwt,
  findProjectsOfLoggedInUser
);
router.put("/api/modify/user-project/:id", verifyjwt, updateUserProject);
router.delete("/api/delete/user-project/:id", verifyjwt, deleteUserProject);

module.exports = router;
