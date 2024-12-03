const Joi = require("joi");

const createUserSchema = Joi.object({
  firstName: Joi.string().min(3).max(30).required().messages({
    "string.base": "First name must be a string.",
    "string.min": "First name must be at least 3 characters long.",
    "string.max": "First name must not exceed 30 characters.",
    "any.required": "First name is required.",
  }),
  lastName: Joi.string().max(30).messages({
    "string.base": "Last name must be a string.",
    "string.max": "Last name must not exceed 30 characters.",
  }),
  email: Joi.string().email().required().messages({
    "string.base": "Email must be a string.",
    "string.email": "Please provide a valid email address.",
    "any.required": "Email is required.",
  }),
  password: Joi.string().min(6).required().messages({
    "string.base": "Password must be a string.",
    "string.min": "Password must be at least 6 characters long.",
    "any.required": "Password is required.",
  }),
});

const updateUserSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string().email(),
  password: Joi.string().min(6),
}).or("name", "email", "password"); // At least one field is required

const getUserSchema = Joi.object({
  id: Joi.number().integer().required(),
});

const deleteUserSchema = Joi.object({
  id: Joi.number().integer().required(),
});

module.exports = {
  createUserSchema,
  updateUserSchema,
  getUserSchema,
  deleteUserSchema,
};
