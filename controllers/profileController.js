const userService = require("../services/userService");
const profileSchema = require("../schemas/profileSchema");
const bcrypt = require("bcrypt");
require("dotenv").config();

async function editUserProfile(req, res) {
  try {
    const user_sno = req.params.id;
    const email = req.user.user_email;
    const existingUser = await userService.findUserById(user_sno);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Userrr does not exist",
      });
    }
    await profileSchema.validateAsync(req.body);

    if (existingUser.user_status === "INACTIVE") {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: "Inactive users cannot be modified",
      });
    }

    if (req.user.user_sno == user_sno) {
      /**
       * a regular employee can update only his user_name and phone nummber details
       */
      var updatedUserProfile = await userService.updateUserProfile(
        user_sno,
        req.body.user_name,
        req.body.user_phone,
        email
      );
      console.log(updatedUserProfile);
      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "You have successfully updated your details",
        updatedUser: updatedUserProfile,
      });
    } else {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: "You cannot modify this user's details",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    if (error.isJoi) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        error: error.details.map((detail) => detail.message),
      });
    } else {
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Something went wrong, failed to update your details",
      });
    }
  }
}

async function editSuperAdminProfile(req, res) {
  try {
    const user_sno = req.params.id;
    const existingUser = await userService.findUserById(user_sno);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "User does not exist",
      });
    }
    await profileSchema.validateAsync(req.body);

    if (req.user.user_email === process.env.EMAIL_USER && user_sno == 1) {
      /**
       * code for super admin updating his details
       */
      var updatedSuperAdmin = await userService.updateSuperAdminProfile(
        user_sno,
        req.body.user_id,
        req.body.user_name,
        req.body.user_phone,
        req.user.user_email
      );
      console.log(updatedSuperAdmin);
      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "You have successfully updated your details",
        updatedSuperAdminProfile: updatedSuperAdmin,
      });
    } else {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: "You cannot modify this user's details",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    if (error.isJoi) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        error: error.details.map((detail) => detail.message),
      });
    } else {
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Something went wrong, failed to update your details",
      });
    }
  }
}

async function fetchLoggedInUser(req, res) {
  try {
    // const logged_in_user_sno = req.user.user_sno;
    const user_sno = req.user.user_sno;

    const user = await userService.findUserById(user_sno);
    if (!user) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "User does not exist",
      });
    } else {
      let userDetails = {};
      userDetails = {
        user_sno: user.user_sno,
        emp_id: user.emp_id,
        user_fullname: user.user_fullname,
        user_firstname: user.user_firstname,
        user_middlename: user.user_middlename,
        user_lastname: user.user_lastname,
        user_name: user.user_name,
        user_phone: user.user_phone,
        user_email: user.user_email,
        user_status: user.user_status,
        role: user.role,
      };
    }
    return res.status(200).json({
      success: true,
      statusCode: 200,
      userDetails: userDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Something went wrong, failed to check",
    });
  }
}

async function changePassword(req, res) {
  const { current_password, new_password, confirm_newpassword } = req.body;
  const user_id = req.user.user_sno;

  if (new_password !== confirm_newpassword) {
    return res.status(400).json({ error: "New passwords do not match" });
  }

  try {
    const user = await userService.findUserById(user_id);
    console.log("The logged in user in changepassword:", user);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(current_password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    const hashedNewPassword = await bcrypt.hash(new_password, 10);
    await userService.updateUserPassword(user_id, hashedNewPassword);

    res
      .status(200)
      .json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
module.exports = {
  editUserProfile,
  editSuperAdminProfile,
  fetchLoggedInUser,
  changePassword,
};
