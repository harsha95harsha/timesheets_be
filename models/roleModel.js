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

  Role.hasMany(sequelize.models.User, {
    foreignKey: "role_id",
    as: "users",
  });

  return Role;
}

module.exports = roleModel;
