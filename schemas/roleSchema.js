const Joi = require("joi");

const roleSchema = Joi.object().keys({
  role_id: Joi.number().required(),
  role_name: Joi.string().required(),
  role_description: Joi.string().required()
});

module.exports = roleSchema;
