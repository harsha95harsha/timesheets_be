// // models/index.js

// // const { db } = require("../db");

// // db.User.belongsToMany(db.Project, {
// //   through: db.UserProject,
// //   foreignKey: "user_sno",
// // });
// // db.Project.belongsToMany(db.User, {
// //   through: db.UserProject,
// //   foreignKey: "project_sno",
// // });

// const userModel = require("./userModel");
// const projectModel = require("./projectModel");
// const userProjectModel = require("./userProjectModel");

// userModel.associate = () => {
//   userModel.belongsToMany(projectModel, { through: userProjectModel });
// };

// projectModel.associate = () => {
//   projectModel.belongsToMany(userModel, { through: userProjectModel });
// };
// module.exports = {};
