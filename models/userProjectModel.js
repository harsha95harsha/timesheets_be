const { DataTypes } = require("sequelize");

function userProjectModel(sequelize) {
  const UserProject = sequelize.define(
    "UserProject",
    {
      id: {
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
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "User",
          key: "user_sno",
        },
      },
      updated_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "User",
          key: "user_sno",
        },
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  UserProject.belongsTo(sequelize.models.User, { foreignKey: "user_sno" });
  UserProject.belongsTo(sequelize.models.Project, {
    foreignKey: "project_sno",
  });

  return UserProject;
}

module.exports = userProjectModel;
