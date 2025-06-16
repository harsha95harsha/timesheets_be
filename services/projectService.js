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
        attributes: ["user_fullname"],
      },
      attributes: [
        "project_sno",
        "project_name",
        "project_description",
        "project_status",
        "project_manager",
        "created_by",
        "updated_by",
        "created_at",
        "updated_at",
      ],
    });

    const results = await projects.map((project) => ({
      project_sno: project.project_sno,
      project_name: project.project_name,
      project_description: project.project_description,
      project_status: project.project_status,
      project_manager: project.manager ? project.manager.user_fullname : null,
      created_by: project.created_by,
      updated_by: project.updated_by,
      created_at: project.created_at,
      updated_at: project.updated_at,
    }));

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
  created_by = null,
  updated_by = null,
}) => {
  try {
    const user = await User.findOne({
      where: {
        user_sno: project_manager,
      },
    });
    if (!user) {
      throw new Error(`User with user_sno '${project_manager}' not found`);
    }

    const newProject = await Project.create({
      project_name,
      project_description,
      project_manager: user.user_sno,
      project_status,
      created_by,
      updated_by,
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
  created_by = null,
  updated_by = null,
}) => {
  try {
    const user = await User.findOne({
      where: {
        user_sno: project_manager,
      },
    });
    if (!user) {
      throw new Error(`User with user_sno '${project_manager}' not found`);
    }
    await Project.update(
      {
        project_name,
        project_description,
        project_manager: user.user_sno,
        project_status,
        created_by,
        updated_by,
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
      created_by,
      updated_by,
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
