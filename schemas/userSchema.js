const Joi = require("joi");

const userSchema = Joi.object().keys({
  user_sno: Joi.number().integer(),
  emp_id: Joi.string()
    .regex(/[A-Za-z0-9]+$/)
    .max(10)
    .required(),
  user_fullname: Joi.string().min(5).max(30).required(),
  user_firstname: Joi.string().min(2).max(30).required(),
  user_middlename: Joi.string().min(0).max(30).allow(null, "").optional(),
  user_lastname: Joi.string().min(2).max(30).required(),
  user_phone: Joi.string()
    .regex(/^\d{10,15}$/)
    .required(),
  user_email: Joi.string().email().required(),
  password: Joi.string()
    .regex(/[A-Za-z0-9@$&.]+$/)
    .max(50),
  user_status: Joi.string().valid("ACTIVE", "INACTIVE"),
  user_otp: Joi.string().max(200).allow(null, "").optional(),
  is_super_admin: Joi.boolean(),
  role_id: Joi.number().required(),
  created_at: Joi.date().optional(),
  updated_at: Joi.date().optional(),
});

module.exports = userSchema;
