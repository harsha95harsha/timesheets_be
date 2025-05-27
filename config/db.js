const { Sequelize } = require("sequelize");
const User = require("../models/userModel");
const Project = require("../models/projectModel");
const UserProject = require("../models/userProjectModel");
const UserTask = require("../models/userTaskModel");
const Role = require("../models/roleModel");
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

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected successfully!");
  } catch (error) {
    console.error("❌ Error connecting:", error);
  }
})();

// Test the connection
// testConnection();

const db = {};
db.User = User(sequelize);
db.Project = Project(sequelize);
db.UserProject = UserProject(sequelize);
db.UserTask = UserTask(sequelize);
db.Role = Role(sequelize);
db.sequelize = sequelize;
// sync all models with database
/*This checks what is the current state of the table in the database (which columns it has,
  what are their data types, etc),
 and then performs the necessary changes in the table to make it match the model.*/
// sequelize.sync({ alter: true });
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("All models were synchronized successfully.");
  })
  .catch((error) => {
    console.error("Unable to sync models with the database:", error);
    process.exit(1);
  });

module.exports = db;
