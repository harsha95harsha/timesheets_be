const express = require("express");
const router = express.Router();
const { verifyjwt } = require("../middlewares/verifyJWT");
const { getDashboardStats } = require("../controllers/analyticsController");

// Get dashboard statistics
router.get("/api/dashboard/stats", verifyjwt, getDashboardStats);

module.exports = router;
