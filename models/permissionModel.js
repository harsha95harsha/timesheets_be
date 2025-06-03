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

  return Permission;
}

module.exports = permissionModel;
