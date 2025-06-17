const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Role = sequelize.define(
    "Role",
    {
      role_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      role_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      role_description: {
        type: DataTypes.STRING(255),
        allowNull: true,
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
      tableName: "roles",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Role.associate = (models) => {
    // Association with User
    Role.hasMany(models.User, {
      foreignKey: "role_id",
      as: "users",
    });

    // Association with Permission (if exists)
    if (models.Permission) {
      Role.belongsToMany(models.Permission, {
        through: "role_permission_association",
        foreignKey: "role_id",
        otherKey: "permission_id",
        as: "permissions",
      });
    }
  };

  // Function to create default roles
  Role.createDefaultRoles = async () => {
    try {
      const defaultRoles = [
        {
          role_id: 1,
          role_name: "SUPER_ADMIN",
          role_description: "Super Administrator with full system access",
        },
        {
          role_id: 2,
          role_name: "ADMIN",
          role_description: "Administrator with elevated privileges",
        },
        {
          role_id: 3,
          role_name: "USER",
          role_description: "Regular user with basic access",
        },
      ];

      for (const role of defaultRoles) {
        await Role.findOrCreate({
          where: { role_id: role.role_id },
          defaults: role,
        });
      }
      console.log("Default roles created successfully");
    } catch (error) {
      console.error("Error creating default roles:", error);
    }
  };

  return Role;
};
