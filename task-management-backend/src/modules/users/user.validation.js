import { body, param, query } from "express-validator";
import { ROLE_LIST, ROLES } from "../../shared/constants/enum.js";
import { MESSAGES } from "../../shared/constants/message.js";
import { MAX_LIMIT } from "../../utils/pagination.js";

export const listUsersValidation = [
  query("role").optional().isIn(ROLE_LIST).withMessage(MESSAGES.VALIDATION.ROLE_INVALID),
  query("page").optional().isInt({ min: 1 }).withMessage(MESSAGES.VALIDATION.PAGE_INVALID),
  query("limit")
    .optional()
    .isInt({ min: 1, max: MAX_LIMIT })
    .withMessage(MESSAGES.VALIDATION.LIMIT_INVALID),
];

export const createUserValidation = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 40 })
    .withMessage(MESSAGES.VALIDATION.USERNAME_LENGTH),
  body("email").trim().isEmail().withMessage(MESSAGES.VALIDATION.EMAIL_INVALID).normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage(MESSAGES.VALIDATION.PASSWORD_MIN_LENGTH),
  body("firstName")
    .optional()
    .trim()
    .isLength({ max: 60 })
    .withMessage(MESSAGES.VALIDATION.FIRST_NAME_LENGTH),
  body("lastName")
    .optional()
    .trim()
    .isLength({ max: 60 })
    .withMessage(MESSAGES.VALIDATION.LAST_NAME_LENGTH),
  body("role").optional().isIn(ROLE_LIST).withMessage(MESSAGES.VALIDATION.ROLE_INVALID),
  body("teamLeadId")
    .optional({ nullable: true })
    .isMongoId()
    .withMessage(MESSAGES.VALIDATION.TEAM_LEAD_ID_INVALID),
];

export const updateUserValidation = [
  param("userId").isMongoId().withMessage(MESSAGES.VALIDATION.USER_ID_INVALID),
  body("username")
    .optional()
    .trim()
    .isLength({ min: 3, max: 40 })
    .withMessage(MESSAGES.VALIDATION.USERNAME_LENGTH),
  body("email").optional().trim().isEmail().withMessage(MESSAGES.VALIDATION.EMAIL_INVALID).normalizeEmail(),
  body("firstName")
    .optional()
    .trim()
    .isLength({ max: 60 })
    .withMessage(MESSAGES.VALIDATION.FIRST_NAME_LENGTH),
  body("lastName")
    .optional()
    .trim()
    .isLength({ max: 60 })
    .withMessage(MESSAGES.VALIDATION.LAST_NAME_LENGTH),
  body("role")
    .optional()
    .isIn([ROLES.MANAGER, ROLES.TEAM_LEAD, ROLES.EMPLOYEE])
    .withMessage(MESSAGES.VALIDATION.ROLE_INVALID),
  body("teamLeadId")
    .optional({ nullable: true })
    .isMongoId()
    .withMessage(MESSAGES.VALIDATION.TEAM_LEAD_ID_INVALID),
];

export const deleteUserValidation = [
  param("userId").isMongoId().withMessage(MESSAGES.VALIDATION.USER_ID_INVALID),
];

export const teamLeadOverviewValidation = [
  query("page").optional().isInt({ min: 1 }).withMessage(MESSAGES.VALIDATION.PAGE_INVALID),
  query("limit")
    .optional()
    .isInt({ min: 1, max: MAX_LIMIT })
    .withMessage(MESSAGES.VALIDATION.LIMIT_INVALID),
];
