const { Sequelize } = require("sequelize");
const User = require("../models/userModel");
const Project = require("../models/projectModel");
const UserProject = require("../models/userProjectModel");
const UserTask = require("../models/userTaskModel");
const Role = require("../models/roleModel");
const Permission = require("../models/permissionModel");
const RolePermission = require("../models/rolePermissionModel");
require("dotenv").config({
  path: require("path").resolve(__dirname, "../environment/.env.local"),
});

console.log(
  "DB_PASS =",
  JSON.stringify(process.env.DB_PASS),
  typeof process.env.DB_PASS
);

console.log("ACCESS_TOKEN_SECRET", process.env.ACCESS_TOKEN_SECRET);

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS || "",
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: "postgres",
    logging: false,
  }
);

const db = {};

db.Permission = Permission(sequelize);
db.Role = Role(sequelize);
db.RolePermission = RolePermission(sequelize);
db.User = User(sequelize);
db.Project = Project(sequelize);
db.UserProject = UserProject(sequelize);
db.UserTask = UserTask(sequelize);
db.sequelize = sequelize;

// Call associate methods if they exist
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Create default roles and permissions
db.Role.createDefaultRoles()
  .then(() => db.Permission.createDefaultPermissions())
  .catch(console.error);

// Synchronize models with the database
sequelize
  .sync({ force: false, alter: false })
  .then(() => {
    console.log("All models were synchronized successfully.");
  })
  .catch((error) => {
    console.error("Error synchronizing models:", error);
  });

module.exports = db;
