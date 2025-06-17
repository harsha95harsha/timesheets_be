const express = require("express");
const router = express.Router();
const { verifyjwt } = require("../middlewares/verifyJWT");
const {
  getDashboardStats,
  getRecentTasks,
} = require("../controllers/dashboardController");

// Get dashboard statistics
router.get("/api/dashboard/stats", verifyjwt, getDashboardStats);

// Get recent tasks
router.get("/api/dashboard/recent-tasks", verifyjwt, getRecentTasks);

module.exports = router;
