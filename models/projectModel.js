const { DataTypes } = require("sequelize");

function projectModel(sequelize) {
  const attributes = {
    project_sno: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    project_name: { type: DataTypes.STRING(30), allowNull: false },
    project_description: { type: DataTypes.STRING(), allowNull: false },
    project_status: {
      type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
      allowNull: false,
      defaultValue: "ACTIVE",
    },
    project_manager: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "User",
        key: "user_sno",
      },
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
  };

  const options = {
    sequelize,
    modelName: "Project",
    tableName: "projects",
    freezeTableName: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  };

  const Project = sequelize.define("Project", attributes, options);

  // Add associations
  Project.belongsTo(sequelize.models.User, {
    foreignKey: "project_manager",
    targetKey: "user_sno",
    as: "manager",
  });

  Project.belongsTo(sequelize.models.User, {
    foreignKey: "created_by",
    targetKey: "user_sno",
    as: "creator",
  });

  Project.belongsTo(sequelize.models.User, {
    foreignKey: "updated_by",
    targetKey: "user_sno",
    as: "updater",
  });

  return Project;
}

module.exports = projectModel;
