const Joi = require("joi");

exports.optimizeSchema = Joi.object({
  start: Joi.string().hex().length(24).required(),
  end: Joi.string().hex().length(24).required(),
});

exports.createRouteSchema = Joi.object({
  fromHub: Joi.string().hex().length(24).required(),
  toHub: Joi.string().hex().length(24).required(),
  distance: Joi.number().positive().required(),
  travelTime: Joi.number().positive().required(),
  fuelCost: Joi.number().positive().required(),
  trafficLevel: Joi.string().valid("LOW", "MEDIUM", "HIGH").optional(),
  isBlocked: Joi.boolean().optional(),
});

exports.trafficSchema = Joi.object({
  trafficLevel: Joi.string().valid("LOW", "MEDIUM", "HIGH").required(),
});

exports.blockSchema = Joi.object({
  isBlocked: Joi.boolean().required(),
});
