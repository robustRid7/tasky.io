const Joi = require("joi");
const base = require("./base.validator");

const signupValidator = Joi.object({
    firstName: Joi.string().min(2).max(30).required(),
    lastName: Joi.string().min(2).max(30).required(),
    userId: Joi.string().alphanum().min(3).max(20).required(),
    password: Joi.string().min(8).max(50).required(),
    email: Joi.string().email().required(),
    profilePicture: Joi.string().uri().optional(),
});

const loginValidator = Joi.object({
    userId: Joi.string().alphanum().min(3).max(20).required(),
    password: Joi.string().min(8).max(50).required(),
});

const resetPassWordValidator = Joi.object({
    userId: Joi.string().alphanum().min(3).max(20).required(),
    password: Joi.string().min(8).max(50).required(),
});

const updateUserProfileValidator = Joi.object({
    firstName: Joi.string().min(2).max(30).required(),
    lastName: Joi.string().min(2).max(30).required(),
    userId: Joi.string().alphanum().min(3).max(20).required(),
    password: Joi.string().min(8).max(50).optional(),
    email: Joi.string().email().required(),
    profilePicture: Joi.string().uri().optional(),
});

module.exports = { signupValidator, loginValidator, resetPassWordValidator, updateUserProfileValidator };
