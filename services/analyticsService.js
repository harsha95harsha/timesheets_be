const db = require("../config/db");
const { Project, UserTask, User } = db;
const { Op } = require("sequelize");

const getDashboardStats = async () => {
  try {
    // Get total tasks
    const totalTasks = await UserTask.count();

    // Get total active projects
    const totalProjects = await Project.count({
      where: {
        project_status: "ACTIVE",
      },
    });

    // Get total users
    const totalUsers = await User.count();

    // Get monthly task completion data
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

    const monthlyData = await UserTask.findAll({
      attributes: [
        [
          db.sequelize.fn(
            "DATE_TRUNC",
            "month",
            db.sequelize.col("created_at")
          ),
          "month",
        ],
        [db.sequelize.fn("COUNT", "*"), "count"],
      ],
      where: {
        created_at: {
          [Op.gte]: sixMonthsAgo,
        },
      },
      group: [
        db.sequelize.fn("DATE_TRUNC", "month", db.sequelize.col("created_at")),
      ],
      order: [
        [
          db.sequelize.fn(
            "DATE_TRUNC",
            "month",
            db.sequelize.col("created_at")
          ),
          "ASC",
        ],
      ],
    });

    // Get tasks by status
    const statusData = await UserTask.findAll({
      attributes: ["task_status", [db.sequelize.fn("COUNT", "*"), "count"]],
      group: ["task_status"],
    });

    // Get tasks by priority (assuming priority is stored in task_description or can be derived)
    const priorityData = await UserTask.findAll({
      attributes: [
        [
          db.sequelize.literal(
            "CASE WHEN task_description LIKE '%high%' THEN 'High' WHEN task_description LIKE '%medium%' THEN 'Medium' ELSE 'Low' END"
          ),
          "priority",
        ],
        [db.sequelize.fn("COUNT", "*"), "count"],
      ],
      group: [
        db.sequelize.literal(
          "CASE WHEN task_description LIKE '%high%' THEN 'High' WHEN task_description LIKE '%medium%' THEN 'Medium' ELSE 'Low' END"
        ),
      ],
    });

    return {
      dashboardStats: {
        totalTasks,
        totalProjects,
        totalUsers,
      },
      monthlyData: monthlyData.map((item) => ({
        month: new Date(item.getDataValue("month")).toLocaleString("default", {
          month: "short",
        }),
        count: parseInt(item.getDataValue("count")),
      })),
      statusData: statusData.map((item) => ({
        status: item.getDataValue("task_status"),
        count: parseInt(item.getDataValue("count")),
      })),
      priorityData: priorityData.map((item) => ({
        priority: item.getDataValue("priority"),
        count: parseInt(item.getDataValue("count")),
      })),
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getDashboardStats,
};
