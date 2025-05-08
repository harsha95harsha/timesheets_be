const Joi = require("joi");

const projectSchema = Joi.object().keys({
  project_sno: Joi.string().regex(/[0-9]+$/),
  project_name: Joi.string().required(),
  project_description: Joi.string(),
  project_status: Joi.string().valid("ACTIVE", "INACTIVE"),
  project_manager: Joi.string().required(),
});

module.exports = projectSchema;
