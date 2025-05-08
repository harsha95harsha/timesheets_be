const Joi = require("joi");

const userTaskSchema = Joi.object().keys({
  ut_sno: Joi.string().regex(/[0-9]+$/),
  user_sno: Joi.string()
    .regex(/[0-9]+$/)
    .required(),

  project_sno: Joi.string().required(),
  task: Joi.string().required(),
  task_description: Joi.string(),
  // ut_status: Joi.string().valid("draft", "pending", "approved", "rejected"),

  task_start_at: Joi.date().required(),
});

module.exports = userTaskSchema;
