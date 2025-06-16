const db = require("../config/db");
const { Project, UserProject, User } = db;
const getAllUserProjects = async () => {
  try {
    const userProjects = await UserProject.findAll();

    const projects = await Project.findAll();
    const users = await User.findAll();

    const userProjectsWithDetails = await Promise.all(
      userProjects.map(async (userProject) => {
        const { project_sno } = userProject;

        const matchingProject = projects.find(
          (project) => project.project_sno === project_sno
        );

        if (!matchingProject) {
          return {
            ...userProject.toJSON(),
            project_name: "Unknown",
            project_description: "Unknown",
            project_status: "Unknown",
            project_manager: "Unknown",
          };
        }

        // const projectManager = users.find(
        //   (user) => user.id === matchingProject.project_manager
        // );
        // const projectManagerName = projectManager
        //   ? projectManager.user_name
        //   : "Unknown";

        // Fetch the user details
        const user = users.find(
          (user) => user.user_sno === userProject.user_sno
        );
        const userName = user ? user.user_name : "Unknown";

        return {
          ...userProject.toJSON(),
          project_name: matchingProject.project_name,
          project_description: matchingProject.project_description,
          project_status: matchingProject.project_status,
          project_manager: matchingProject.project_manager,
          user_name: userName,
        };
      })
    );

    console.log("All user projects with details:", userProjectsWithDetails);

    return userProjectsWithDetails;
  } catch (error) {
    console.error("Error fetching all user projects", error);
    throw error;
  }
};

const findUserProjectById = async (id) => {
  return await db.UserProject.findByPk(id);
};
const findUserProjectsByProjectName = async (project_name) => {
  try {
    return await db.UserProject.findOne({
      where: { project_name: project_name },
    });
  } catch (error) {
    console.error("Error getting user project by project_name:", error);
    throw error;
  }
};
const findUserProjectsByUserSno = async (user_sno) => {
  try {
    return await db.UserProject.findAll({
      where: { user_sno: user_sno },
    });
  } catch (error) {
    console.error("Error getting UserProject by user_sno:", error);
    throw error;
  }
};
const findUserProjectsByProjectSno = async (project_sno) => {
  try {
    return await db.UserProject.findOne({
      where: { project_sno: project_sno },
    });
  } catch (error) {
    console.error("Error getting UserProject by project_sno:", error);
    throw error;
  }
};

const createUserProject = async ({
  user_sno,
  project_sno,
  is_active = true,
  created_by = null,
  updated_by = null,
}) => {
  try {
    const user = await User.findOne({
      where: {
        user_sno: user_sno,
      },
    });
    const project = await Project.findOne({
      where: {
        project_sno: project_sno,
      },
    });
    if (!user) {
      throw new Error(`User with user_sno '${user_sno}' not found`);
    }
    if (!project) {
      throw new Error(`Project with project_sno '${project_sno}' not found`);
    }

    const newUserProject = await UserProject.create({
      user_sno,
      project_sno,
      is_active,
      created_by,
      updated_by,
    });
    return newUserProject;
  } catch (error) {
    throw error;
  }
};

const updateUserProject = async ({
  id,
  user_sno,
  project_sno,
  is_active,
  created_by = null,
  updated_by = null,
}) => {
  await UserProject.update(
    { id, user_sno, project_sno, is_active, created_by, updated_by },
    {
      where: {
        id: id,
      },
    }
  );

  return { id, user_sno, project_sno, is_active, created_by, updated_by };
};

const deleteUserProject = async (id) => {
  await db.UserProject.destroy({
    where: { id: id },
  });
};

async function getProjectByProjectSno(project_sno) {
  try {
    const project = await db.Project.findOne({
      where: { project_sno: project_sno },
    });
    return project;
  } catch (error) {
    console.log("Error fetching project by project_sno:", error);
    throw error;
  }
}
module.exports = {
  getAllUserProjects,
  findUserProjectById,
  createUserProject,
  updateUserProject,
  deleteUserProject,
  findUserProjectsByUserSno,
  getProjectByProjectSno,
  findUserProjectsByProjectSno,
  findUserProjectsByProjectName,
};
