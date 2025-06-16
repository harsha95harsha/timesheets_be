const Joi = require("joi");

const userProjectSchema = Joi.object().keys({
  id: Joi.number().integer(),
  user_sno: Joi.number().integer().required(),
  project_sno: Joi.number().integer().required(),
  is_active: Joi.boolean().default(true),
  created_by: Joi.number().integer().optional(),
  updated_by: Joi.number().integer().optional(),
  created_at: Joi.date().optional(),
  updated_at: Joi.date().optional(),
});

module.exports = userProjectSchema;
