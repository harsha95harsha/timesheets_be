const { where } = require("sequelize");
const db = require("../config/db");
const bcrypt = require("bcrypt");
const { User, Role } = db;

const getAllUsers = async () => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: Role,
          as: "Role",
          attributes: ["role_name", "role_description"],
        },
      ],
    });
    return users;
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    throw error;
  }
};

const findUserById = async (user_sno) => {
  try {
    console.log("Finding user by ID:", user_sno);
    const user = await User.findByPk(user_sno, {
      include: [
        {
          model: Role,
          as: "Role",
          attributes: ["role_name", "role_description"],
        },
      ],
    });
    console.log("Found user with role:", user);
    return user;
  } catch (error) {
    console.error("Error in findUserById:", error);
    throw error;
  }
};

const findUserByEmail = async (user_email) => {
  try {
    const user = await User.findOne({
      where: {
        user_email: user_email,
      },
      include: [
        {
          model: Role,
          as: "Role",
          attributes: ["role_name", "role_description"],
        },
      ],
    });
    return user;
  } catch (error) {
    console.error("Error in findUserByEmail:", error);
    throw error;
  }
};

const findUserByName = async (user_fullname) => {
  try {
    return await User.findOne({
      where: {
        user_fullname: user_fullname,
      },
      include: [
        {
          model: Role,
          as: "Role",
          attributes: ["role_name", "role_description"],
        },
      ],
    });
  } catch (error) {
    console.error("Error in findUserByName:", error);
    throw error;
  }
};

const createUser = async ({
  emp_id,
  user_fullname,
  user_firstname,
  user_middlename,
  user_lastname,
  user_phone,
  user_email,
  password,
  user_status = "ACTIVE",
  user_otp = null,
  role_id,
}) => {
  const newUser = await User.create({
    emp_id,
    user_fullname,
    user_firstname,
    user_middlename,
    user_lastname,
    user_phone,
    user_email,
    password,
    user_status,
    user_otp,
    role_id,
  });
  return newUser;
};

const updateUser = async (user_sno, userData) => {
  await User.update(
    {
      ...userData,
    },
    {
      where: {
        user_sno: user_sno,
      },
    }
  );

  return { user_sno, ...userData };
};

const updateUserProfileByEmail = async (
  user_fullname,
  user_phone,
  user_email
) => {
  await User.update(
    {
      user_fullname: user_fullname,
      user_phone: user_phone,
    },
    {
      where: {
        user_email: user_email,
      },
    }
  );
  return {
    user_fullname: user_fullname,
    user_phone: user_phone,
    user_email: user_email,
  };
};

const updateUserProfile = async (
  user_sno,
  user_fullname,
  user_phone,
  user_email
) => {
  await User.update(
    {
      user_fullname: user_fullname,
      user_phone: user_phone,
      user_email: user_email,
    },
    {
      where: {
        user_sno: user_sno,
      },
    }
  );

  return {
    user_sno,
    user_fullname,
    user_phone,
    user_email,
  };
};

const updateUserOTPByEmail = async (user_email, hashedOTPInfo) => {
  try {
    await User.update(
      {
        user_otp: hashedOTPInfo,
      },
      {
        where: {
          user_email: user_email,
        },
      }
    );
    console.log("OTP updated successfully in the database");
    return { success: true, message: "OTP updated successfully" };
  } catch (error) {
    console.error("Error updating OTP in the database:", error);
    return { success: false, message: "Failed to update OTP" };
  }
};

const updateUserPassword = async (user_sno, new_password) => {
  try {
    await User.update(
      { password: new_password },
      {
        where: { user_sno: user_sno },
      }
    );

    return {
      success: true,
      message: "Password updated successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to update password",
    };
  }
};

const updateUserPasswordByEmail = async (user_email, new_password) => {
  try {
    const hashedPassword = await bcrypt.hash(new_password, 10);

    await User.update(
      { password: hashedPassword },
      {
        where: { user_email: user_email },
      }
    );

    return {
      success: true,
      message: "Password updated successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to update password",
    };
  }
};

const deleteUser = async (user_sno) => {
  await User.destroy({
    where: { user_sno: user_sno },
  });
};

module.exports = {
  getAllUsers,
  findUserById,
  findUserByName,
  findUserByEmail,
  createUser,
  updateUser,
  updateUserProfileByEmail,
  updateUserProfile,
  updateUserOTPByEmail,
  updateUserPassword,
  updateUserPasswordByEmail,
  deleteUser,
};
