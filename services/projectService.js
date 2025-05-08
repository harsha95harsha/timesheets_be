const db = require("../config/db");
const { QueryTypes } = require("sequelize");
const { User, Project } = db;
// const { fetchProjectsAndManagers } = require("../scripts/fetchData");

const getAllProjects = async () => {
  return await Project.findAll();
};
const fetchProjects = async () => {
  try {
    const projects = await Project.findAll({
      include: {
        model: User,
        as: "manager",
        attributes: ["user_name"],
      },
      attributes: [
        "project_sno",
        "project_name",
        "project_description",
        "project_status",
        "project_manager",
      ],
    });

    const results = await projects.map((project) => ({
      project_sno: project.project_sno,
      project_name: project.project_name,
      project_description: project.project_description,
      project_status: project.project_status,
      project_manager: project.manager ? project.manager.user_name : null,
    }));

    console.log(results);

    return results;
  } catch (err) {
    console.error("Error fetching projects", err);
    throw err;
  }
};
const findProjectById = async (project_sno) => {
  return await Project.findByPk(project_sno);
};

const getProjectsByUserSno = async (user_sno) => {
  return await Project.findAll({
    where: { user_sno },
  });
};

const createProject = async ({
  project_name,
  project_description,

  project_manager,
  project_status = "ACTIVE",
}) => {
  try {
    const user = await User.findOne({
      where: {
        user_name: project_manager,
      },
    });
    console.log(user);
    if (!user) {
      throw new Error(`User with name '${project_manager}' not found`);
    }

    const newProject = await Project.create({
      project_name,
      project_description,

      project_manager: user.user_sno,
      project_status,
    });
    return newProject;
  } catch (error) {
    throw error;
  }
};

const updateProject = async ({
  project_sno,
  project_name,
  project_description,
  project_manager,
  project_status,
}) => {
  try {
    const user = await User.findOne({
      // include: {
      //   model: Project,
      //   as: "manager", // Alias for the User model to be associated with project_manager
      //   attributes: ["user_sno"],
      // },
      where: {
        user_name: project_manager,
      },
    });
    console.log(user);
    console.log(user.user_name);

    if (!user) {
      throw new Error(`User with name '${project_manager}' not found`);
    }
    await Project.update(
      {
        project_name,
        project_description,
        project_manager: user.user_sno,
        project_status,
      },
      {
        where: {
          project_sno: project_sno,
        },
      }
    );

    return {
      project_sno,
      project_name,
      project_description,
      project_manager,
      project_status,
    };
  } catch (error) {
    throw error;
  }
};

const deleteProject = async (project_sno) => {
  await Project.destroy({
    where: { project_sno: project_sno },
  });
};

module.exports = {
  getAllProjects,
  fetchProjects,
  findProjectById,
  getProjectsByUserSno,
  // fetchProjectManagers,
  createProject,
  updateProject,
  deleteProject,
};
