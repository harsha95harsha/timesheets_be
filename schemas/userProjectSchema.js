const Joi = require("joi");

const userProjectSchema = Joi.object().keys({
  id: Joi.string().regex(/[0-9]+$/),
  user_sno: Joi.string().regex(/[0-9]+$/),

  project_sno: Joi.string().regex(/[0-9]+$/),

  is_active: Joi.string().regex(/[1-2]+$/),
});

module.exports = userProjectSchema;
