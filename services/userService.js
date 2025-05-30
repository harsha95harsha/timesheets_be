const { where } = require("sequelize");
const db = require("../config/db");
const bcrypt = require("bcrypt");

const getAllUsers = async () => {
  return await db.User.findAll();
};

const findUserById = async (user_sno) => {
  return await db.User.findByPk(user_sno);
};

const findUserByEmail = async (user_email) => {
  return await db.User.findOne({
    where: {
      user_email: user_email,
    },
  });
};

const findUserByName = async (user_name) => {
  try {
    return await db.User.findOne({
      where: {
        user_name: user_name,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const createSuperAdmin = async ({
  emp_id,
  user_fullname,
  user_firstname,
  user_middlename,
  user_lastname,
  user_phone,
  user_email,
  password,
  user_status,
  is_super_admin,
  role_id,
}) => {
  const superAdmin = await db.User.create({
    emp_id,
    user_fullname,
    user_firstname,
    user_middlename,
    user_lastname,
    user_phone,
    user_email,
    password,
    user_status,
    is_super_admin,
    role_id,
  });
  return superAdmin;
};

const createUser = async ({
  user_id,
  user_name,
  user_phone,
  user_email,
  password,
  user_status = "ACTIVE", //default
}) => {
  const newUser = await db.User.create({
    user_id,
    user_name,
    user_phone,
    user_email,
    password,
    user_status,
  });
  return newUser;
};

const updateUser = async (
  user_sno,
  user_id,
  user_name,
  user_email,
  user_phone
) => {
  await db.User.update(
    {
      user_id,
      user_name,
      user_email,
      user_phone,
    },
    {
      where: {
        user_sno: user_sno,
      },
    }
  );

  return {
    user_sno,
    user_id,
    user_name,
    user_email,
    user_phone,
  };
};
const updateUserProfileByEmail = async (user_name, user_phone, user_email) => {
  await db.User.update(
    {
      user_name,

      user_phone,
    },
    {
      where: {
        user_email: user_email,
      },
    }
  );
  return {
    user_name,

    user_phone,
    user_email,
  };
};

const updateSuperAdminProfile = async (
  user_sno,
  user_id,
  user_name,

  user_phone,
  user_email
) => {
  await db.User.update(
    {
      user_id,
      user_name,

      user_phone,
    },
    {
      where: {
        user_sno: user_sno,
      },
    }
  );
  return {
    user_sno,
    user_id,
    user_name,

    user_phone,
    user_email,
  };
};
const updateUserProfile = async (
  user_sno,
  user_name,
  user_phone,
  user_email
) => {
  await db.User.update(
    {
      user_name,
      user_phone,
    },
    {
      where: {
        user_sno: user_sno,
      },
    }
  );

  return {
    user_sno,
    user_name,
    user_phone,
    user_email,
  };
};

const updateUserOTPByEmail = async (user_email, hashedOTPInfo) => {
  try {
    await db.User.update(
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
    await db.User.update(
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

    await db.User.update(
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
  await db.User.destroy({
    where: { user_sno: user_sno },
  });
};

module.exports = {
  getAllUsers,
  findUserById,
  findUserByName,
  findUserByEmail,
  createSuperAdmin,
  createUser,
  updateUser,
  updateSuperAdminProfile,
  updateUserProfileByEmail,
  updateUserProfile,
  updateUserOTPByEmail,
  updateUserPassword,
  updateUserPasswordByEmail,
  deleteUser,
};
