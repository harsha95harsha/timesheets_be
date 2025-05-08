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
  };

  const options = {
    sequelize,
    modelName: "Project",
    freezeTableName: true,
    timestamps: false,
  };

  const Project = sequelize.define("Project", attributes, options);
  Project.belongsTo(sequelize.models.User, {
    foreignKey: "project_manager",
    targetKey: "user_sno",
    as: "manager",
  });
  return Project;
}

module.exports = projectModel;
