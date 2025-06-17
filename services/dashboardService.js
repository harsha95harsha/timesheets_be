const db = require("../config/db");
const { User, Project, UserTask } = db;

const getDashboardStats = async () => {
  try {
    // Get total counts
    const total_tasks = await UserTask.count();
    const total_projects = await Project.count({
      where: { project_status: "ACTIVE" },
    });
    const total_users = await User.count({
      where: { user_status: "ACTIVE" },
    });

    // Get task status counts
    const pending_tasks = await UserTask.count({
      where: { task_status: "pending" },
    });
    const in_progress_tasks = await UserTask.count({
      where: { task_status: "in_progress" },
    });
    const completed_tasks = await UserTask.count({
      where: { task_status: "completed" },
    });

    return {
      total_tasks,
      total_projects,
      total_users,
      pending_tasks,
      in_progress_tasks,
      completed_tasks,
    };
  } catch (error) {
    console.error("Error getting dashboard stats:", error);
    throw error;
  }
};

module.exports = {
  getDashboardStats,
};
