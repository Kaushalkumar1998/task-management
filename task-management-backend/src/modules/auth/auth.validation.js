import { body } from "express-validator";
import { ROLES } from "../../shared/constants/enum.js";
import { MESSAGES } from "../../shared/constants/message.js";

export const loginValidation = [
  body("email")
    .notEmpty()
    .withMessage(MESSAGES.VALIDATION.EMAIL_REQUIRED)
    .bail()
    .isEmail()
    .withMessage(MESSAGES.VALIDATION.EMAIL_INVALID),

  body("password")
    .notEmpty()
    .withMessage(MESSAGES.VALIDATION.PASSWORD_REQUIRED)
    .bail()
    .isString()
    .withMessage(MESSAGES.VALIDATION.PASSWORD_STRING),
];

export const registerValidation = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage(MESSAGES.VALIDATION.USERNAME_REQUIRED)
    .bail()
    .isLength({ min: 3, max: 40 })
    .withMessage(MESSAGES.VALIDATION.USERNAME_LENGTH),

  body("email")
    .trim()
    .notEmpty()
    .withMessage(MESSAGES.VALIDATION.EMAIL_REQUIRED)
    .bail()
    .isEmail()
    .withMessage(MESSAGES.VALIDATION.EMAIL_INVALID)
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage(MESSAGES.VALIDATION.PASSWORD_REQUIRED)
    .bail()
    .isLength({ min: 8 })
    .withMessage(MESSAGES.VALIDATION.PASSWORD_MIN_LENGTH)
    .matches(/[A-Z]/)
    .withMessage(MESSAGES.VALIDATION.PASSWORD_UPPERCASE)
    .matches(/[a-z]/)
    .withMessage(MESSAGES.VALIDATION.PASSWORD_LOWERCASE)
    .matches(/[0-9]/)
    .withMessage(MESSAGES.VALIDATION.PASSWORD_NUMBER),

  body("firstName").optional().trim().isLength({ max: 60 }),
  body("lastName").optional().trim().isLength({ max: 60 }),
  body("role")
    .optional()
    .equals(ROLES.EMPLOYEE)
    .withMessage(MESSAGES.AUTH.PUBLIC_EMPLOYEE_ONLY),
];
