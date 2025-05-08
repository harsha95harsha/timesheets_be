const db = require("../config/db");
const { Project, UserTask, User } = db;
const getAllUserTasks = async () => {
  try {
    const userTasks = await UserTask.findAll({
      include: [
        {
          model: Project,
          as: "project", // Alias for the project model to be associated with project_name
          attributes: ["project_name"], // Only select user_name from project model
        },
        {
          model: User,
          as: "user", // Alias for the project model to be associated with project_name
          attributes: ["user_name"], // Only select user_name from project model
        },
        {
          model: User,
          as: "user", // Alias for the project model to be associated with project_name
          attributes: ["user_email"], // Only select user_name from project model
        },
      ],

      attributes: [
        "ut_sno",
        "user_sno",
        "project_sno",

        "task",
        "task_description",
        "ut_status",
        "task_start_at", // Include project_manager field
      ],
    });
    return userTasks;
  } catch (error) {
    throw error;
  }
};

const getTasksOfLoggedInUser = async (user_sno) => {
  return await UserTask.findAll({
    where: { user_sno: user_sno },
    include: [
      {
        model: Project,
        as: "project",
        attributes: ["project_name"],
      },
      {
        model: User,
        as: "user",
        attributes: ["user_name"],
      },
      {
        model: User,
        as: "user",
        attributes: ["user_email"],
      },
    ],
    attributes: [
      "ut_sno",
      "user_sno",
      "project_sno",

      "task",
      "task_description",
      "ut_status",
      "task_start_at", // Include project_manager field
    ],
  });
};

const findUserTaskById = async (ut_sno) => {
  return await UserTask.findOne({
    where: { ut_sno: ut_sno },
    include: [
      {
        model: User,
        as: "user",
        attributes: ["user_email"],
      },
      {
        model: User,
        as: "user",
        attributes: ["user_name"],
      },
      {
        model: Project,
        as: "project",
        attributes: ["project_name"],
      },
    ],
    attributes: [
      "ut_sno",
      "user_sno",
      "project_sno",

      "task",
      "task_description",
      "ut_status",
      "task_start_at", // Include project_manager field
    ],
  });
};

const createUserTask = async ({
  user_sno,
  project_sno,
  task,
  task_description,
  ut_status,
  task_start_at,
}) => {
  const newUserTask = await db.UserTask.create({
    user_sno,

    project_sno,
    task,
    task_description,
    ut_status,
    task_start_at,
  });
  return newUserTask;
};

const updateUserTask = async ({
  ut_sno,
  user_sno,
  project_sno,
  task,
  task_description,
  ut_status,
  task_start_at,
}) => {
  await db.UserTask.update(
    {
      user_sno,
      project_sno,
      task,
      task_description,
      ut_status,
      task_start_at,
    },
    {
      where: {
        ut_sno: ut_sno,
      },
    }
  );

  return {
    ut_sno,
    user_sno,
    project_sno,
    task,
    task_description,
    ut_status,
    task_start_at,
  };
};

const deleteUserTask = async (ut_sno) => {
  await db.UserTask.destroy({
    where: { ut_sno: ut_sno },
  });
};

module.exports = {
  getAllUserTasks,
  getTasksOfLoggedInUser,
  findUserTaskById,
  createUserTask,
  updateUserTask,
  deleteUserTask,
};
