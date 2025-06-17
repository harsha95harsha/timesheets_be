const dashboardService = require("../services/dashboardService");
const userTaskService = require("../services/userTaskService");

const getDashboardStats = async (req, res) => {
  try {
    const stats = await dashboardService.getDashboardStats();
    res.status(200).json({
      success: true,
      statusCode: 200,
      ...stats,
    });
  } catch (error) {
    console.error("Error in getDashboardStats:", error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Failed to fetch dashboard statistics",
    });
  }
};

const getRecentTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const tasks = await userTaskService.getRecentTasks(page, limit);

    res.status(200).json({
      success: true,
      statusCode: 200,
      tasks: tasks,
    });
  } catch (error) {
    console.error("Error in getRecentTasks:", error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Failed to fetch recent tasks",
    });
  }
};

module.exports = {
  getDashboardStats,
  getRecentTasks,
};
