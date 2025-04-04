const Joi = require("joi");

const base = {
    admin: Joi.string(),
    validRole: Joi.number(),
    id: Joi.string(),
    contestUserDomain: Joi.string().allow(null, ""),
    contestUserAdmin: Joi.string().allow(null, ""),
};

module.exports = base;
