const { DataTypes } = require("sequelize");

function dashboardStatsModel(sequelize) {
  const attributes = {
    total_tasks: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    total_projects: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    total_users: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    pending_tasks: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    in_progress_tasks: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    completed_tasks: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  };

  const options = {
    sequelize,
    modelName: "DashboardStats",
    tableName: "dashboard_stats",
    freezeTableName: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  };

  return sequelize.define("DashboardStats", attributes, options);
}

module.exports = dashboardStatsModel;
