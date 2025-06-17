const db = require("../config/db");
const { Project, UserTask, User } = db;
const getAllUserTasks = async () => {
  try {
    const userTasks = await UserTask.findAll({
      include: [
        {
          model: Project,
          as: "project",
          attributes: ["project_name"],
        },
        {
          model: User,
          as: "user",
          attributes: ["user_fullname"],
        },
      ],
      attributes: [
        "ut_sno",
        "user_sno",
        "project_sno",
        "task_name",
        "task_description",
        "task_status",
        "no_of_hours",
        "created_at",
        "updated_at",
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
        attributes: ["user_fullname"],
      },
    ],
    attributes: [
      "ut_sno",
      "user_sno",
      "project_sno",
      "task_name",
      "task_description",
      "task_status",
      "no_of_hours",
      "created_at",
      "updated_at",
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
        attributes: ["user_fullname"],
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
      "task_name",
      "task_description",
      "task_status",
      "no_of_hours",
      "created_at",
      "updated_at",
    ],
  });
};

const createUserTask = async ({
  user_sno,
  project_sno,
  task_name,
  task_description,
  task_status = "draft",
  no_of_hours,
  created_at = null,
  updated_at = null,
}) => {
  const newUserTask = await db.UserTask.create({
    user_sno,
    project_sno,
    task_name,
    task_description,
    task_status,
    no_of_hours,
    created_at,
    updated_at,
  });
  return newUserTask;
};

const updateUserTask = async ({
  ut_sno,
  user_sno,
  project_sno,
  task_name,
  task_description,
  task_status,
  no_of_hours,
  created_at = null,
  updated_at = null,
}) => {
  await UserTask.update(
    {
      user_sno,
      project_sno,
      task_name,
      task_description,
      task_status,
      no_of_hours,
      created_at,
      updated_at,
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
    task_name,
    task_description,
    task_status,
    no_of_hours,
    created_at,
    updated_at,
  };
};

const deleteUserTask = async (ut_sno) => {
  await db.UserTask.destroy({
    where: { ut_sno: ut_sno },
  });
};

const getRecentTasks = async (page = 1, limit = 5) => {
  try {
    const offset = (page - 1) * limit;

    const tasks = await UserTask.findAll({
      include: [
        {
          model: Project,
          as: "project",
          attributes: ["project_name"],
        },
        {
          model: User,
          as: "user",
          attributes: ["user_fullname"],
        },
      ],
      attributes: [
        "ut_sno",
        "user_sno",
        "project_sno",
        "task_name",
        "task_description",
        "task_status",
        "no_of_hours",
        "created_at",
        "updated_at",
      ],
      order: [["created_at", "DESC"]],
      limit: limit,
      offset: offset,
    });

    return tasks;
  } catch (error) {
    console.error("Error getting recent tasks:", error);
    throw error;
  }
};

module.exports = {
  getAllUserTasks,
  getTasksOfLoggedInUser,
  findUserTaskById,
  createUserTask,
  updateUserTask,
  deleteUserTask,
  getRecentTasks,
};
