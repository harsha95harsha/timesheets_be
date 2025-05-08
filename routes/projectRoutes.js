const express = require("express");
const router = express.Router();
const { verifyjwt } = require("../middlewares/verifyJWT");
const {
  getAllProjects,
  // fetchProjectManagers,
  // getUserProjectsOfLoggedInUser,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  fetchProjectDetails,
} = require("../controllers/projectController");

router.get("/api/list/projects", verifyjwt, getAllProjects);
// router.get(
//   "/api/list/logged_in_user/user_projects",
//   verifyjwt,
//   getUserProjectsOfLoggedInUser
// );
router.get("/api/list/projectdetails", verifyjwt, fetchProjectDetails);
router.post("/api/create/project", verifyjwt, createProject);
router.get("/api/list/project/:id", verifyjwt, getProjectById);
router.put("/api/modify/project/:id", verifyjwt, updateProject);
router.delete("/api/delete/project/:id", verifyjwt, deleteProject);

module.exports = router;
