const projectService = require("../services/projectService");
const userProjectService = require("../services/userProjectService");
const projectSchema = require("../schemas/projectSchema");
const { Project } = require("../config/db");
const { isAdmin, isProjectManager } = require("../utils/permissionUtils");

async function getAllProjects(req, res) {
  try {
    var project = await projectService.getAllProjects();

    if (!project) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "The requested Project does not exist",
      });
    }

    res.status(200).json({ success: true, statusCode: 200, project: project });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Something went wrong, failed to get the Projects list",
    });
  }
}

async function createProject(req, res) {
  try {
    await projectSchema.validateAsync(req.body);

    if (isAdmin(req.user) || isProjectManager(req.user)) {
      var createdProject = await projectService.createProject(req.body);
      console.log(createdProject);
      res.status(201).json({
        success: true,
        statusCode: 201,
        message: "Project created succesfully",
        createdProject,
      });
      console.log(createdProject);
    } else {
      res.status(403).json({
        success: false,
        statusCode: 403,
        message: "Only admin or project manager can create a Project",
      });
    }
  } catch (validationError) {
    if (validationError) {
      console.error(validationError);
      res.status(400).json({
        success: false,
        statusCode: 400,
        error: validationError.details.map((detail) => detail.message),
      });
    } else {
      res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Something went wrong, failed to create project",
      });
    }
  }
}

async function getProjectById(req, res) {
  try {
    var project = await projectService.findProjectById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        error: "The requsted Project does not exist",
      });
    }
    return res.status(200).json({ success: true, project: project });
  } catch (error) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      error: "Something went wrong, cannot get the requested Project",
    });
  }
}

async function updateProject(req, res) {
  try {
    const project_sno = req.params.id;
    var existingProject = await projectService.findProjectById(project_sno);
    console.log(existingProject);
    if (!existingProject) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        error: "Project does not exist",
      });
    }

    if (existingProject.project_status === "INACTIVE") {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: "Inactive Project cannot be modified",
      });
    }

    await projectSchema.validateAsync(req.body);

    if (isAdmin(req.user) || isProjectManager(req.user)) {
      var updatedProject = await projectService.updateProject({
        ...req.body,
        project_sno,
      });
      console.log(updatedProject);
      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "The project is updated successfully",
        updatedProject: updatedProject,
      });
    } else {
      res.status(403).json({
        success: false,
        statusCode: 403,
        message: "Only admin or project manager can update a Project",
      });
    }
  } catch (validationError) {
    if (validationError) {
      console.error(validationError);
      res.status(400).json({
        success: false,
        statusCode: 400,
        error: validationError.details.map((detail) => detail.message),
      });
    } else {
      res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Something went wrong, failed to update the project",
      });
    }
  }
}

async function deleteProject(req, res) {
  try {
    var existingProject = await projectService.findProjectById(req.params.id);
    if (!existingProject) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        error: "Project does not exist",
      });
    }

    if (existingProject.project_status === "INACTIVE") {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: "Inactive User Project cannot be deleted",
      });
    }
    if (isAdmin(req.user)) {
      await existingProject.update({ project_status: "INACTIVE" });
      return res.json({
        success: true,
        statusCode: 200,
        message: `Project with id: ${req.params.id} is deleted successfully`,
      });
    } else {
      res.status(403).json({
        success: false,
        statusCode: 403,
        message: "Only admin can delete a Project",
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ statusCode: 500, error: "Something went wrong" });
  }
}

async function fetchProjectDetails(req, res) {
  try {
    const loggedInUser = req.user;

    let userProjects = [];

    if (isAdmin(req.user)) {
      userProjects = await projectService.fetchProjects();
      // userProjects = await userProjectService.getAllUserProjects();
    } else {
      userProjects = await userProjectService.findUserProjectsByUserSno(
        loggedInUser.user_sno
      );
    }

    if (!userProjects || userProjects.length === 0) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "There are no User Projects available to show",
      });
    }

    const userProjectsWithDetails = await Promise.all(
      userProjects.map(async (userProject) => {
        const { project_sno } = userProject;
        const projectDetails = await Project.findOne({
          where: { project_sno },
        });

        const projects = await projectService.fetchProjects();

        const matchingProject = projects.find(
          (project) => project.project_sno === project_sno
        );
        if (!matchingProject) {
          return {
            ...JSON.parse(JSON.stringify(userProject)),
            project_name: projectDetails.project_name,
            project_description: projectDetails.project_description,
            project_status: projectDetails.project_status,
            project_manager: "Unknown",
          };
        }

        return {
          ...JSON.parse(JSON.stringify(userProject)),
          project_name: projectDetails.project_name,
          project_description: projectDetails.project_description,
          project_status: projectDetails.project_status,
          project_manager: matchingProject.project_manager,
        };
      })
    );

    console.log(
      "The logged in userProject details are :",
      userProjectsWithDetails
    );

    res.status(200).json({
      success: true,
      projectsList: userProjectsWithDetails,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Something went wrong, failed to get the User Projects list",
    });
  }
}

module.exports = {
  getAllProjects,
  fetchProjectDetails,
  // getUserProjectsOfLoggedInUser,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
};
