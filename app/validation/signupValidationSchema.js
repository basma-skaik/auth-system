const Joi = require("joi");

// WhatsApp-compatible phone number format (e.g., +972599123456)
const phoneRegex = /^\+[1-9]\d{1,14}$/;

const signupValidationSchema = Joi.object({
  fullName: Joi.string().min(3).max(100).required().messages({
    "string.empty": "Full name is required",
    "string.min": "Full name should be at least 3 characters",
  }),

  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email",
    "string.empty": "Email is required",
  }),

  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "string.empty": "Password is required",
  }),

  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match",
    "string.empty": "Confirm password is required",
  }),

  phone: Joi.string().pattern(phoneRegex).required().messages({
    "string.pattern.base":
      "Phone number must be in WhatsApp international format, e.g., +972599123456",
    "string.empty": "Phone number is required",
  }),

  acceptedPolicy: Joi.boolean().valid(true).required().messages({
    "any.only": "You must accept the policies and privacy terms",
  }),
});

module.exports = signupValidationSchema;
