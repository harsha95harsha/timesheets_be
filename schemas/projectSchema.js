const Joi = require("joi");

const projectSchema = Joi.object().keys({
  project_sno: Joi.number().integer(),
  project_name: Joi.string().required(),
  project_description: Joi.string().allow(null, "").optional(),
  project_status: Joi.string().valid("ACTIVE", "INACTIVE").default("ACTIVE"),
  project_manager: Joi.number().integer().required(),
  created_by: Joi.number().integer().optional(),
  updated_by: Joi.number().integer().optional(),
  created_at: Joi.date().optional(),
  updated_at: Joi.date().optional(),
});

module.exports = projectSchema;
