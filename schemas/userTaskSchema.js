const Joi = require("joi");

const userTaskSchema = Joi.object().keys({
  ut_sno: Joi.number().integer(),
  user_sno: Joi.number().integer().required(),
  project_sno: Joi.number().integer().required(),
  task_name: Joi.string().required(),
  task_description: Joi.string().allow(null, "").optional(),
  task_status: Joi.string()
    .valid("draft", "pending", "approved", "rejected")
    .default("draft"),
  no_of_hours: Joi.number().integer().min(0).required(),
  created_at: Joi.date().optional(),
  updated_at: Joi.date().optional(),
});

module.exports = userTaskSchema;
