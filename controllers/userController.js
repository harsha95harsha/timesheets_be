const userService = require("../services/userService");
const userSchema = require("../schemas/userSchema");
require("dotenv").config();
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
require("dotenv").config();

async function getAllUsers(res) {
  try {
    var user = await userService.getAllUsers();
    if (!user) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "User Does not exist",
      });
    }
    res.status(200).json({ success: true, statusCode: 200, user: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Something went wrong, failed to get the users list",
    });
  }
}

async function isSuperAdmin(req, res) {
  try {
    const is_super_admin = req.user.is_super_admin;
    if (!is_super_admin) {
      return res.json({
        success: false,
        // statusCode: 400,
        message: "this user is not a super admin",
        is_super_admin: is_super_admin,
      });
    }
    res
      .status(200)
      .json({ success: true, statusCode: 200, is_super_admin: is_super_admin });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Something went wrong, failed to check",
    });
  }
}

async function getLoggedInUserSno(req, res) {
  try {
    const user_sno = req.user.user_sno;
    if (!user_sno) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "User Does not exist",
      });
    }
    res
      .status(200)
      .json({ success: true, statusCode: 200, user_sno: user_sno });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Something went wrong, failed to get the logged in user sno",
    });
  }
}

function generateRandomPassword(length) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

async function createSuperAdmin(req, res) {
  try {
    await userSchema.validateAsync(req.body);

    const temp_password = generateRandomPassword(8);

    const hashedPassword = await bcrypt.hash(temp_password, 10);

    var superAdmin = await userService.createSuperAdmin({
      ...req.body,
      password: hashedPassword,
    });
    console.log(
      `Temperory password is ${temp_password} \n Hashed password is ${hashedPassword}`
    );

    console.log(superAdmin);

    res.status(200).json({
      statusCode: 200,
      success: true,
      msg: "SuperAdmin created succesfully",
      superAdmin: superAdmin,
    });
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
        message: "Something went wrong, failed to create super admin",
      });
    }
  }
}

async function createUser(req, res) {
  try {
    console.log(req.user.is_super_admin);

    if (req.user.is_super_admin) {
      const existingUserEmail = await userService.findUserByEmail(
        req.body.user_email
      );

      if (existingUserEmail) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          error: "User already exists",
        });
      }
      await userSchema.validateAsync(req.body);

      const temp_password = generateRandomPassword(8);

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: req.body.user_email,
        subject: "Welcome to our application",
        text: `Your username is: ${req.body.user_name}\nYour user e-mail is: ${req.body.user_email}\nYour password is: ${temp_password}`,
      };

      console.log("The temperory password is", temp_password);
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      });

      const hashedPassword = await bcrypt.hash(temp_password, 10);
      var createdUser = await userService.createUser({
        ...req.body,
        password: hashedPassword,
      });

      console.log(createdUser);

      res.status(200).json({
        statusCode: 201,
        success: true,
        msg: "User created succesfully",
        createdUser: createdUser,
      });
    } else {
      res.status(403).json({
        success: false,
        statusCode: 403,
        message: "Only super admin can create users",
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
        message: "Something went wrong, failed to create user ",
      });
    }
  }
}

async function resendInvite(userData) {
  try {
    const temp_password = generateRandomPassword(8);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userData.user_email,
      subject: "Welcome to our application (Resend)",
      text: `Your username is: ${userData.user_name}\nYour user e-mail is: ${userData.user_email}\nYour password is: ${temp_password}`,
    };

    console.log("Resending invite with temporary password:", temp_password);

    await transporter.sendMail(mailOptions);

    return temp_password;
  } catch (error) {
    console.error("Error resending invite:", error);
    throw error;
  }
}

async function getUserById(req, res) {
  try {
    var user = await userService.findUserById(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ statusCode: 404, error: "User Does not exist" });
    }
    return res.status(200).json({ success: true, statusCode: 200, user: user });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      error: "Something went wrong, failed to get the user details",
    });
  }
}

async function updateUser(req, res) {
  try {
    const user_sno = req.params.id;
    var existingUser = await userService.findUserById(user_sno);
    console.log(existingUser);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "User Does not exist",
      });
    }

    if (existingUser.user_status === "INACTIVE") {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: "Inactive users cannot be modified",
      });
    }

    await userSchema.validateAsync(req.body);

    if (req.user.is_super_admin) {
      /**
       * super admin can update/modify the user_name, phone number and email of the employees
       */
      var updatedUser = await userService.updateUser(
        user_sno,
        req.body.user_id,
        req.body.user_name,
        req.body.user_email,
        req.body.user_phone
      );
      console.log(updatedUser);
      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: `You have updated the details of the user ${req.body.user_name} successfully`,
        updatedUser: updatedUser,
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
        message: "Something went wrong, failed to update the user",
      });
    }
  }
}

async function deleteUser(req, res) {
  try {
    var existingUser = await userService.findUserById(req.params.id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "User Does not exist",
      });
    }

    if (existingUser.user_status === "INACTIVE") {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: "Inactive users cannot be deleted",
      });
    }

    if (req.user.is_super_admin) {
      await existingUser.update({ user_status: "INACTIVE" });
      return res.json({
        success: true,
        statusCode: 200,
        message: `User with id: ${req.params.id} is deleted successfully`,
      });
    } else {
      res.status(403).json({
        success: false,
        statusCode: 403,
        message: "You are not allowed to delete the user",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Something went wrong, user cannot be deleted",
    });
  }
}

function generateOTP() {
  return Math.floor(Math.random() * 9000 + 1000);
}

async function forgotPassword(req, res) {
  try {
    const user = await userService.findUserByEmail(req.body.user_email);
    if (!user) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "User not found",
      });
    }

    const otp = generateOTP();

    const hashedOTPInfo = await bcrypt.hash(JSON.stringify(otp), 10);

    await userService.updateUserOTPByEmail(req.body.user_email, hashedOTPInfo);
    console.log(otp);
    console.log(hashedOTPInfo);

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: req.body.user_email,
      subject: "Reset Password OTP",
      text: `Your OTP for resetting the password is: ${otp}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    console.log("OTP sent successfully");

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Failed to send OTP",
    });
  }
}

async function resetPassword(req, res) {
  try {
    const user = await userService.findUserByEmail(req.body.user_email);
    if (!user) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "User not found",
      });
    }

    const otpMatch = await bcrypt.compare(
      req.body.user_otp.toString(),
      user.user_otp
    );

    if (!otpMatch) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Invalid OTP",
      });
    }

    const result = await userService.updateUserPasswordByEmail(
      req.body.user_email,
      req.body.new_password
    );

    if (result.success) {
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      let mailOptions = {
        from: process.env.EMAIL_USER,
        to: req.body.user_email,
        subject: "Password Changed Successfully",
        text: `Your password has been changed successfully.`,
      };

      // await transporter.sendMail(mailOptions);
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      });

      console.log("Password reset successfully");
      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Password reset successfully",
      });
    } else {
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Failed to reset password",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Failed to reset password",
    });
  }
}

module.exports = {
  getAllUsers,
  getLoggedInUserSno,
  createSuperAdmin,
  createUser,
  getUserById,
  updateUser,
  isSuperAdmin,
  deleteUser,
  forgotPassword,
  resetPassword,
};
