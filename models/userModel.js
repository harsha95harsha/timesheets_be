const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      user_sno: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      emp_id: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      user_fullname: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      user_firstname: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      user_middlename: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      user_lastname: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      user_phone: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
      user_email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      user_status: {
        type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
        defaultValue: "ACTIVE",
      },
      user_otp: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      is_super_admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "roles",
          key: "role_id",
        },
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
      tableName: "User",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  User.associate = (models) => {
    // Association with Role
    User.belongsTo(models.Role, {
      foreignKey: "role_id",
      as: "Role",
    });

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
