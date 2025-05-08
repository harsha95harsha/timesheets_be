const { QueryTypes } = require("sequelize");

const db = require("../config/db");
const { User, Project } = db;

async function fetchProjectsAndManagers(userSno) {
  try {
    const test = db;
    const projects = await Project.findAll({
      include: {
        model: User,
        as: "manager",
        attributes: ["user_name"],
        l,
      },
      attributes: [
        "project_sno",
        "project_name",
        "project_description",
        "project_status",
        "project_manager",
      ],
    });

    const userProjects = projects.filter((project) =>
      project.manager ? project.manager.user_sno === userSno : false
    );

    const results = userProjects.map((project) => ({
      project_sno: project.project_sno,
      project_name: project.project_name,
      project_description: project.project_description,
      project_status: project.project_status,
      project_manager: project.manager ? project.manager.user_name : null,
    }));

    console.log(results);

    return results;
  } catch (err) {
    console.error("Error fetching data", err);
    throw err;
  }
}

module.exports = { fetchProjectsAndManagers };
/*SELECT usertask.user_sno,usertask.task,usertask.task_description, project.project_name AS project_sno
     FROM usertask
       INNER JOIN project ON usertask.project_sno = project.project_name;*/
