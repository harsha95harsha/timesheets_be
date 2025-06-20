const userTaskService = require("../services/userTaskService");
const userProjectService = require("../services/userProjectService");
const userTaskSchema = require("../schemas/userTaskSchema");
const { isAdmin } = require("../utils/permissionUtils");

async function getAllUserTasks(req, res) {
  try {
    if (isAdmin(req.user)) {
      var userTasks = await userTaskService.getAllUserTasks();

      console.log("All user task details", userTasks);
      if (!userTasks) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          message: "UserTasks list Does not exist",
        });
      }

      console.log("the user tasks for admin: ", userTasks);
      res.status(200).json({ success: true, userTasks: userTasks });
    }
  } catch (error) {
    console.log(error);
    if (error.response && error.response.status === 401) {
      getTasksOfLoggedInUser(req.user.user_sno);
    }
    // res.status(500).json({
    //   success: false,
    //   statusCode: 500,
    //   message: "Something went wrong, failed to get the userTasks list",
    // });
  }
}

async function getTasksOfLoggedInUser(req, res) {
  try {
    const userTasks = await userTaskService.getTasksOfLoggedInUser(
      req.user.user_sno
    );

    console.log("All user task details", userTasks);
    if (!userTasks || userTasks.length === 0) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "No tasks found for the logged-in user",
      });
    }

    res.status(200).json({ success: true, userTasks: userTasks });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Something went wrong, failed to get the userTasks list",
    });
  }
}

async function getUserProjectsOfLoggedInUser(req, res) {
  try {
    const userProjects = await userProjectService.findUserProjectsByUserSno(
      req.user.user_sno
    );

    console.log("All user project details", userProjects);
    if (!userProjects || userProjects.length === 0) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "No projects found for the logged-in user",
      });
    }

    res.status(200).json({ success: true, userProjects: userProjects });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Something went wrong, failed to get the userProjects list",
    });
  }
}

async function createUserTask(req, res) {
  try {
    await userTaskSchema.validateAsync(req.body);
    if (req.user.user_sno == req.body.user_sno) {
      var createdUserTask = await userTaskService.createUserTask(req.body);
      console.log("Created User Task Details", createdUserTask);
      res.status(201).json({
        success: true,
        statusCode: 201,
        msg: "User Task created succesfully",
        createdUserTask: createdUserTask,
      });
    } else {
      res.status(403).json({
        success: false,
        statusCode: 403,
        message:
          "This user is forbidden to create the task with other user's information ",
      });
    }
  } catch (validationError) {
    if (validationError) {
      console.error(validationError);
      res.status(400).json({
        success: false,
        statusCode: 400,
        error: validationError.details.map((detail) => detail.message),
      });
    } else {
      res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Something went wrong, failed to create user",
      });
    }
  }
}

async function getUserTaskById(req, res) {
  try {
    const ut_sno = req.params.id;
    var userTask = await userTaskService.findUserTaskById(ut_sno);
    // var userTask = await userTaskService.getTasksOfLoggedInUser
    console.log(`The details of userTask with ut_sno ${ut_sno} are`, userTask);
    if (!userTask) {
      return res
        .status(404)
        .json({ statusCode: 404, error: "UserTask Does not exist" });
    }
    return res
      .status(200)
      .json({ success: true, statusCode: 200, userTask: userTask });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      error: "Something went wrong, failed to get the userTask details",
    });
  }
}

async function updateUserTask(req, res) {
  try {
    const ut_sno = req.params.id;
    var existingUserTask = await userTaskService.findUserTaskById(ut_sno);
    console.log(existingUserTask);
    if (!existingUserTask) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "UserTask Does not exist",
      });
    }

    await userTaskSchema.validateAsync(req.body);
    if (req.user.user_sno == req.body.user_sno) {
      var updatedUserTask = await userTaskService.updateUserTask({
        ...req.body,
        ut_sno,
      });
      console.log("The updated user task details are ", updatedUserTask);
      return res.status(200).json({
        success: true,
        statusCode: 200,
        msg: "UserTask successfully updated",
        updatedUserTask: updatedUserTask,
      });
    } else {
      res.status(403).json({
        success: false,
        statusCode: 403,
        message: "This user is forbidden to perform the modification",
      });
    }
  } catch (validationError) {
    if (validationError) {
      console.error(validationError);
      res.status(400).json({
        success: false,
        statusCode: 400,
        error: validationError.details.map((detail) => detail.message),
      });
    } else {
      res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Something went wrong, failed to create user",
      });
    }
  }
}

async function deleteUserTask(req, res) {
  try {
    var existingUserTask = await userTaskService.findUserTaskById(
      req.params.id
    );
    if (!existingUserTask) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "UserTask Does not exist",
      });
    }

    if (isAdmin(req.user)) {
      await userTaskService.deleteUserTask(req.params.id);

      return res.json({
        success: true,
        statusCode: 200,
        message: `UserTask with id: ${req.params.id} is deleted successfully`,
      });
    } else {
      res.status(403).json({
        success: false,
        statusCode: 403,
        message: "Only admin can delete User Task",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Something went wrong, userTask cannot be deleted",
    });
  }
}

module.exports = {
  getAllUserTasks,
  getTasksOfLoggedInUser,
  getUserProjectsOfLoggedInUser,
  createUserTask,
  getUserTaskById,
  updateUserTask,
  deleteUserTask,
};
