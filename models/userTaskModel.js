const { DataTypes } = require("sequelize");

function userTaskModel(sequelize) {
  const UserTask = sequelize.define(
    "UserTask",
    {
      ut_sno: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_sno: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "User",
          key: "user_sno",
        },
      },
      project_sno: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Project",
          key: "project_sno",
        },
      },

      task_name: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      task_description: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      task_status: {
        type: DataTypes.ENUM("draft", "pending", "approved", "rejected"),
      },
      no_of_hours: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  UserTask.belongsTo(sequelize.models.User, {
    foreignKey: "user_sno",
    as: "user",
  });
  UserTask.belongsTo(sequelize.models.Project, {
    foreignKey: "project_sno",
    as: "project",
  });

  return UserTask;
}

module.exports = userTaskModel;
