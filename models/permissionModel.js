const { DataTypes } = require("sequelize");

function permissionModel(sequelize) {
  const attributes = {
    permission_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    permission_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    permission_description: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
  };

  const options = {
    sequelize,
    modelName: "Permission",
    tableName: "permissions",
    freezeTableName: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  };

  const Permission = sequelize.define("Permission", attributes, options);

  Permission.associate = (models) => {
    Permission.belongsToMany(models.Role, {
      through: "role_permission_association",
      foreignKey: "permission_id",
      otherKey: "role_id",
    });
  };

  // Function to create default permissions and associate them with roles
  Permission.createDefaultPermissions = async () => {
    try {
      const defaultPermissions = [
        {
          permission_name: "view_user",
          permission_description: "Can view user list and details",
        },
        {
          permission_name: "create_user",
          permission_description: "Can create new users",
        },
        {
          permission_name: "edit_user",
          permission_description: "Can edit user details",
        },
        {
          permission_name: "delete_user",
          permission_description: "Can delete users",
        },
        {
          permission_name: "view_project",
          permission_description: "Can view project list and details",
        },
        {
          permission_name: "create_project",
          permission_description: "Can create new projects",
        },
        {
          permission_name: "edit_project",
          permission_description: "Can edit project details",
        },
        {
          permission_name: "delete_project",
          permission_description: "Can delete projects",
        },
        // Task-related permissions
        {
          permission_name: "view_task",
          permission_description: "Can view task list and details",
        },
        {
          permission_name: "create_task",
          permission_description: "Can create new tasks",
        },
        {
          permission_name: "edit_task",
          permission_description: "Can edit task details",
        },
        {
          permission_name: "delete_task",
          permission_description: "Can delete tasks",
        },
      ];

      // Create permissions
      for (const permission of defaultPermissions) {
        await Permission.findOrCreate({
          where: { permission_name: permission.permission_name },
          defaults: permission,
        });
      }

      // Get all roles and permissions
      const roles = await sequelize.models.Role.findAll();
      const permissions = await Permission.findAll();

      // Associate permissions with roles
      for (const role of roles) {
        if (role.role_name === "Admin") {
          // Admin gets all permissions
          await role.setPermissions(permissions);
        } else if (role.role_name === "PROJECT_MANAGER") {
          // Project Manager gets project-related permissions and view permissions
          const projectManagerPermissions = permissions.filter(
            (p) =>
              p.permission_name === "view_user" ||
              p.permission_name === "view_project" ||
              p.permission_name === "edit_project" ||
              p.permission_name === "view_task"
          );
          await role.setPermissions(projectManagerPermissions);
        } else if (role.role_name === "USER") {
          // Regular users get view permissions and task CRUD permissions
          const userPermissions = permissions.filter(
            (p) =>
              p.permission_name === "view_user" || // Explicitly include view_user
              p.permission_name === "view_project" ||
              p.permission_name === "view_task" ||
              p.permission_name === "create_task" ||
              p.permission_name === "edit_task" ||
              p.permission_name === "delete_task"
          );
          await role.setPermissions(userPermissions);
        }
      }

      console.log(
        "Default permissions created and associated with roles successfully"
      );
    } catch (error) {
      console.error("Error creating default permissions:", error);
    }
  };

  return Permission;
}

module.exports = permissionModel;
