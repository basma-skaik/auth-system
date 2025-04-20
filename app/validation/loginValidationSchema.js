const Joi = require("joi");

// WhatsApp-compatible phone number format (e.g., +972599123456)
const phoneRegex = /^\+[1-9]\d{1,14}$/;

const loginValidationSchema = Joi.object({
  phone: Joi.string().pattern(phoneRegex).required().messages({
    "string.pattern.base":
      "Phone number must be in WhatsApp international format, e.g., +972599123456",
    "string.empty": "Phone number is required",
  }),

  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "string.empty": "Password is required",
  }),

  rememberMe: Joi.boolean().optional(),
});

module.exports = loginValidationSchema;
