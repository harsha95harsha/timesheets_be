const userTaskService = require("../services/userTaskService");
const db = require("../config/db");
const { Project, User } = db;
const userProjectService = require("../services/userProjectService");
const nodemailer = require("nodemailer");
const { isAdmin } = require("../utils/permissionUtils");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const addLoggedInUserSno = (req, res, next) => {
  req.body.user_sno = req.user.user_sno;
  next();
};

const submitTask = async (req, res) => {
  try {
    const { project_name, task, task_description, task_start_at } = req.body;
    const loggedInUserSno = req.user.user_sno;
    const loggedInUserEmail = req.user.user_email;

    if (!project_name || !task_description || !task_start_at || !task) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const userProjects = await userProjectService.findUserProjectsByUserSno(
      req.user.user_sno
    );

    console.log(userProjects);

    if (!userProjects || userProjects.length === 0) {
      return res
        .status(400)
        .json({ error: "You are not assigned to any projects" });
    }

    console.log(req.body.user_sno);
    console.log(loggedInUserSno);

    if (req.body.user_sno !== loggedInUserSno) {
      return res.status(403).json({
        error: "You are not authorized to submit tasks for other users",
      });
    }
    const project = await Project.findOne({
      where: {
        project_name: project_name,
      },
    });
    console.log("Project details:", project);
    if (!project) {
      throw new Error(`Project with name '${project_name}' not found`);
    }

    const userName = await User.findOne({
      where: {
        user_sno: loggedInUserSno,
      },
    });
    console.log("User details:", userName);
    if (!userName) {
      throw new Error(`User with name '${userName}' not found`);
    }

    const newUserTask = await db.UserTask.create({
      user_sno: loggedInUserSno,
      project_sno: project.project_sno,
      task,
      task_description,
      ut_status: "draft",
      task_start_at,
    });
    console.log("New User Task:", newUserTask);

    await db.UserTask.update(
      { ut_status: "pending" },
      { where: { ut_sno: newUserTask.ut_sno } }
    );

    const updatedTask = await db.UserTask.findOne({
      where: { ut_sno: newUserTask.ut_sno },
      include: [
        {
          model: Project,
          as: "project",
        },
        {
          model: User,
          as: "user",
        },
      ],
    });
    console.log("The Project Name is : ", project.project_name);

    console.log("Submitted task:", updatedTask);

    const mailOptions = {
      from: loggedInUserEmail,
      to: process.env.EMAIL_USER,
      subject: "New Task Submission",
      html: `
        <h1>New Task Submitted</h1>
        <p>Task details:</p>
        <ul>
          <li>Project Name: ${updatedTask.project.project_name}</li>
          <li>Task: ${task}</li>
          <li>Submitted By: ${updatedTask.user.user_name}</li>
          <li>Description: ${task_description}</li>
          <li>Start Date: ${task_start_at}</li>
        </ul>
        <p>Please review and take necessary action.</p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res.status(200).json({
      success: true,
      message: "Task submitted successfully",
      submittedTask: {
        ut_sno: updatedTask.ut_sno,
        user_sno: updatedTask.user_sno,
        user_name: updatedTask.user.user_name,
        project_sno: updatedTask.project_sno,
        project_name: updatedTask.project.project_name,
        user_email: updatedTask.user.user_email,
        task: updatedTask.task,
        task_description: updatedTask.task_description,
        ut_status: updatedTask.ut_status,
        task_start_at: updatedTask.task_start_at,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const withdrawTask = async (req, res) => {
  try {
    const ut_sno = req.params.id;
    const task = await userTaskService.findUserTaskById(ut_sno);
    console.log(task);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    console.log(task);

    if (task.ut_status === "pending") {
      await db.UserTask.destroy({
        where: { ut_sno },
      });

      res.status(200).json({
        success: true,
        message: `Task with id ${task.ut_sno} and name "${task.task}" withdrawn successfully`,
      });
    } else {
      if (req.user.user_sno == task.user_sno) {
        res.status(403).json({
          success: false,
          statusCode: 403,
          message: "You can only withdraw tasks in pending status",
        });
      } else {
        res.status(403).json({
          success: false,
          statusCode: 403,
          message: "You are not authorized to withdraw this task",
        });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const approveTask = async (req, res) => {
  try {
    const ut_sno = req.params.id;
    const isAdminUser = isAdmin(req.user);

    if (isAdminUser) {
      const task = await userTaskService.findUserTaskById(ut_sno);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }

      console.log("TASK TO BE APPROVED:", task);
      if (task.ut_status === "rejected" || task.ut_status === "approved") {
        return res.status(400).json({
          error: "This task cannot be approved or rejected again!",
        });
      }

      await userTaskService.updateUserTask({
        ...task,
        ut_status: "approved",
        ut_sno,
      });
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: task.user.user_email,
        subject: "Task Approval Notification",
        html: `
          <h1>Task Approved</h1>
          <p>Your task has been approved by the admin.</p>
          <p>Task details:</p>
          <ul>
            <li>Task ID: ${ut_sno}</li>
            <li>Task Name: ${task.task}</li>
          </ul>
        `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      });

      res
        .status(200)
        .json({ success: true, message: "Task approved successfully!" });
    } else {
      res.json({ message: "You are not entitled to approve this task!" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const rejectTask = async (req, res) => {
  try {
    const ut_sno = req.params.id;
    const isAdminUser = isAdmin(req.user);

    if (isAdminUser) {
      const task = await userTaskService.findUserTaskById(ut_sno);
      if (!task) {
        return res.status(404).json({ error: "Task not found!" });
      }

      if (task.ut_status === "approved" || task.ut_status === "rejected") {
        return res.status(400).json({
          error: "This task cannot be approved or rejected again!",
        });
      }

      await userTaskService.updateUserTask({
        ...task,
        ut_status: "rejected",
        ut_sno,
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: task.user.user_email,
        subject: "Task Rejection Notification",
        html: `
          <h1>Task Rejected</h1>
          <p>Your task has been rejected by the admin.</p>
          <p>Task details:</p>
          <ul>
            <li>Task ID: ${ut_sno}</li>
            <li>Task Name: ${task.task}</li>
          </ul>
        `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      });

      res
        .status(200)
        .json({ success: true, message: "Task rejected successfully!" });
    } else {
      res.json({ message: "You cannot reject this task!" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  addLoggedInUserSno,
  withdrawTask,
  submitTask,
  approveTask,
  rejectTask,
};
