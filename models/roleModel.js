const { DataTypes } = require("sequelize");

function roleModel(sequelize) {
  const attributes = {
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    role_name: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    role_description: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
  };

  const options = {
    sequelize,
    modelName: "Role",
    freezeTableName: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  };

  const Role = sequelize.define("Role", attributes, options);

  Role.associate = (models) => {
    Role.hasMany(models.User, {
      foreignKey: "role_id",
      as: "users",
    });

    Role.belongsToMany(models.Permission, {
      through: "role_permission_association",
      foreignKey: "role_id",
      otherKey: "permission_id",
    });
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
}

module.exports = roleModel;
