const Joi = require("joi");

const profileSchema = Joi.object().keys({
  user_sno: Joi.string().regex(/[0-9]+$/),
  user_id: Joi.string()
    .regex(/[A-Za-z0-9]+$/)
    .max(10),
  user_name: Joi.string().min(5).max(30).required(),
  user_phone: Joi.string()
    .regex(/^\d{10}$/)
    .required(),
  user_email: Joi.string().email(),
});

module.exports = profileSchema;
