const Joi = require("joi");

exports.hubSchema = Joi.object({
  name: Joi.string().required(),
  code: Joi.string().required(),
});
