const userProjectService = require("../services/userProjectService");
const userProjectSchema = require("../schemas/userProjectSchema");
const { Project, User, UserProject } = require("../config/db");
const { getUserProjectsOfLoggedInUser } = require("./userTaskController");
async function getAllUserProjects(req, res) {
  try {
    var userProjects = await userProjectService.getAllUserProjects();

    if (!userProjects) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "There are no User Projects available to show",
      });
    }
    res.status(200).json({ success: true, userProjects: userProjects });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Something went wrong, failed to get the User Projects list",
    });
  }
}

async function createUserProject(req, res) {
  try {
    const { user_sno, project_sno } = req.body;
    await userProjectSchema.validateAsync(req.body);

    if (!project_sno || !user_sno) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (req.user.is_super_admin) {
      var project = await Project.findOne({
        where: {
          project_sno: project_sno,
        },
      });

      console.log("The selected project is :", project);
      var user = await User.findOne({
        where: {
          user_sno: user_sno,
        },
      });
      console.log("The selected user is :", user);
      if (!project || !user) {
        return res.status(404).json({ error: "Project or User not found" });
      }
      console.log("User name:", user.user_name);
      console.log("Project name:", project.project_name);

      const createdUserProject = await UserProject.create({
        user_sno: user_sno,
        project_sno: project_sno,
        // user_name: user.user_name,
        // project_name: project.project_name,
        is_active: true,
      });

      createdUserProject.user_name = user.user_name;
      createdUserProject.project_name = project.project_name;
      console.log("New User Project:", createdUserProject);
      console.log("User name:", createdUserProject.user_name);
      console.log("Project name:", createdUserProject.project_name);

      res.status(201).json({
        success: true,
        msg: "User Project is created succesfully",
        newUserProject: {
          id: createdUserProject.id,
          user_sno: createdUserProject.user_sno,
          project_sno: createdUserProject.project_sno,
          user_name: createdUserProject.user_name,
          project_name: createdUserProject.project_name,
          is_active: true,
        },
      });
    } else {
      res.status(403).json({
        success: false,
        statusCode: 403,
        message: "Only super admin can create User Projects",
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
        message: "Something went wrong, failed to create User Project",
      });
    }
  }
}

async function getUserProjectById(req, res) {
  try {
    var userProject = await userProjectService.findUserProjectById(
      req.params.id
    );
    if (!userProject) {
      return res
        .status(404)
        .json({ statusCode: 404, error: "User Project Does not exist" });
    }
    return res
      .status(200)
      .json({ success: true, statusCode: 200, userProject: userProject });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      error:
        "Something went wrong, failed to get the requested User Project details",
    });
  }
}

async function getUserProjectsByUserSno(req, res) {
  try {
    const user_sno = req.params.id;
    var userProjects = await userProjectService.findUserProjectsByUserSno(
      user_sno
    );
    if (!userProjects) {
      return res.status(404).json({
        statusCode: 404,
        error: "The requested User Projects does not exist",
      });
    }
    return res
      .status(200)
      .json({ success: true, statusCode: 200, userProjects: userProjects });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      error:
        "Something went wrong, failed to get the requested User Project details",
    });
  }
}

async function getUserProjectsByProjectSno(req, res) {
  try {
    const project_sno = req.params.id;
    var userProjects = await userProjectService.findUserProjectsByProjectSno(
      project_sno
    );
    console.log(userProjects);
    if (!userProjects) {
      return res.status(404).json({
        statusCode: 404,
        error: "The requested User Projects does not exist",
      });
    }
    return res
      .status(200)
      .json({ success: true, statusCode: 200, userProjects: userProjects });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      error:
        "Something went wrong, failed to get the requested User Project details",
    });
  }
}

async function updateUserProject(req, res) {
  try {
    const { id } = req.params;
    const { user_sno, project_sno } = req.body;
    await userProjectSchema.validateAsync(req.body);

    if (!project_sno || !user_sno) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const userProject = await UserProject.findOne({ where: { id } });
    if (!userProject) {
      return res.status(404).json({ error: "User Project not found" });
    }

    if (!userProject.is_active) {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: "Inactive User Project cannot be modified",
      });
    }

    if (req.user.is_super_admin) {
      const project = await Project.findOne({
        where: {
          project_sno: project_sno,
        },
      });

      console.log("The selected project is:", project);
      const user = await User.findOne({
        where: {
          user_sno: user_sno,
        },
      });

      console.log("The selected user is:", user);

      if (!project || !user) {
        return res.status(404).json({ error: "Project or User not found" });
      }

      console.log("User name:", user.user_name);
      console.log("Project name:", project.project_name);

      const updatedUserProject = await UserProject.update(
        {
          user_sno: user_sno,
          project_sno: project_sno,
        },
        {
          where: { id: id },
          returning: true, // Return the updated row
        }
      );

      // if (!updatedUserProject[0]) {
      //   return res.status(404).json({ error: "User Project not found" });
      // }

      // const updatedUserProjectData = updatedUserProject[1][0].toJSON();

      updatedUserProject.user_name = user.user_name;
      updatedUserProject.project_name = project.project_name;

      console.log("Updated User Project:", updatedUserProject);
      console.log("User name:", updatedUserProject.user_name);
      console.log("Project name:", updatedUserProject.project_name);

      res.status(200).json({
        success: true,
        msg: "User Project is updated successfully",
        updatedUserProject: {
          id: id,
          user_sno: user.user_sno,
          project_sno: project.project_sno,
          user_name: updatedUserProject.user_name,
          project_name: updatedUserProject.project_name,
          is_active: true,
        },
      });
    } else {
      res.status(403).json({
        success: false,
        statusCode: 403,
        message: "Only super admin can update User Projects",
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
        message: "Something went wrong, failed to update User Project",
      });
    }
  }
}

async function deleteUserProject(req, res) {
  try {
    var existingUserProject = await userProjectService.findUserProjectById(
      req.params.id
    );
    if (!existingUserProject) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "UserProject Does not exist",
      });
    }
    if (!existingUserProject.is_active) {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: "Inactive User Project cannot be deleted",
      });
    }
    if (req.user.is_super_admin) {
      await existingUserProject.update({ is_active: false });
      return res.json({
        success: true,
        statusCode: 200,
        message: `UserProject with id: ${req.params.id} is deleted successfully`,
      });
    } else {
      res.status(403).json({
        success: false,
        statusCode: 403,
        message: "Only super admin can delete User Project",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Something went wrong, userProject cannot be deleted",
    });
  }
}

async function findProjectsOfLoggedInUser(req, res) {
  try {
    const userProjects = await userProjectService.findUserProjectsByUserSno(
      req.user.user_sno
    );

    if (!userProjects || userProjects.length === 0) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "There are no User Projects available to show",
      });
    }
    const userProjectsWithDetails = await Promise.all(
      userProjects.map(async (userProject) => {
        const { project_sno, is_active } = userProject;
        const projectDetails = await Project.findOne({
          where: { project_sno },
        });

        if (!projectDetails) {
          return {
            ...userProject.toJSON(),
            project_name: "Unknown",
            project_description: "Unknown",
            project_status: "Unknown",
            project_manager: "Unknown",
          };
        }

        return {
          ...userProject.toJSON(),
          project_name: projectDetails.project_name,
          project_description: projectDetails.project_description,
          project_status: projectDetails.project_status,
          project_manager: projectDetails.project_manager,
        };
      })
    );

    console.log(
      "The logged in userProject details are :",
      userProjectsWithDetails
    );

    res.status(200).json({
      success: true,
      userProjects: userProjectsWithDetails,
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
  getAllUserProjects,
  createUserProject,
  getUserProjectById,
  findProjectsOfLoggedInUser,
  getUserProjectsByUserSno,
  getUserProjectsByProjectSno,
  updateUserProject,
  deleteUserProject,
};
