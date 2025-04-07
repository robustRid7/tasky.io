const Joi = require("joi");

const base = {
    userId: Joi.string(),
    id: Joi.string(),
};

module.exports = base;
