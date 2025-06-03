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
        model: "users",
        key: "user_id",
      },
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "user_id",
      },
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "user_id",
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
  Project.belongsTo(sequelize.models.User, {
    targetTable: "users",
    foreignKey: "project_manager",
    targetKey: "user_id",
    as: "manager",
  });
  return Project;
}

module.exports = projectModel;
