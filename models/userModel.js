const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      first_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone_number: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 3, // Default to USER role (role_id = 3)
      },
      status: {
        type: DataTypes.ENUM("active", "inactive"),
        defaultValue: "active",
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "users",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  User.associate = (models) => {
    // Association with Project (if exists)
    if (models.Project) {
      User.belongsToMany(models.Project, {
        through: "user_projects",
        foreignKey: "user_id",
        otherKey: "project_id",
        as: "projects",
      });
    }

    // Association with Task (if exists)
    if (models.Task) {
      User.belongsToMany(models.Task, {
        through: "user_tasks",
        foreignKey: "user_id",
        otherKey: "task_id",
        as: "tasks",
      });
    }
  };

  return User;
};
