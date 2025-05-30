const { DataTypes } = require("sequelize");

function userModel(sequelize) {
  const attributes = {
    user_sno: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    emp_id: { type: DataTypes.STRING(10), allowNull: false },
    user_fullname: { type: DataTypes.STRING(30), allowNull: false },
    user_firstname: { type: DataTypes.STRING(30), allowNull: false },
    user_middlename: { type: DataTypes.STRING(30), allowNull: true },
    user_lastname: { type: DataTypes.STRING(30), allowNull: false },
    user_phone: { type: DataTypes.STRING(10), allowNull: false },
    user_email: { type: DataTypes.STRING(100), allowNull: false },
    password: { type: DataTypes.STRING(200), allowNull: true },
    user_status: {
      type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
      allowNull: false,
      defaultValue: "ACTIVE",
    },
    user_otp: { type: DataTypes.STRING(200) },
    is_super_admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Role",
        key: "role_id",
      },
    },
  };

  const options = {
    sequelize,
    modelName: "User",
    freezeTableName: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  };

  const User = sequelize.define("User", attributes, options);

  // User.hasMany(sequelize.models.Project, {
  //   foreignKey: "user_sno",
  //   as: "manager",
  // });

  // User.hasMany(sequelize.models.UserProject, {
  //   foreignKey: "user_sno",
  // });

  // User.belongsTo(sequelize.models.UserTask, {
  //   foreignKey: "user_sno",
  // });

  return User;
}

module.exports = userModel;
