import { body, param, query } from "express-validator";
import { TASK_STATUS_LIST } from "../../shared/constants/enum.js";
import { MESSAGES } from "../../shared/constants/message.js";
import { MAX_LIMIT } from "../../utils/pagination.js";

export const createTaskValidation = [
  body("title")
    .trim()
    .isLength({ min: 3, max: 120 })
    .withMessage(MESSAGES.VALIDATION.TITLE_LENGTH),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage(MESSAGES.VALIDATION.DESCRIPTION_LENGTH),
  body("status")
    .optional()
    .isIn(TASK_STATUS_LIST)
    .withMessage(MESSAGES.VALIDATION.STATUS_INVALID),
  body("assignedTo")
    .optional()
    .isMongoId()
    .withMessage(MESSAGES.VALIDATION.ASSIGNED_TO_INVALID),
];

export const updateTaskValidation = [
  param("taskId").isMongoId().withMessage(MESSAGES.VALIDATION.TASK_ID_INVALID),
  body("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 120 })
    .withMessage(MESSAGES.VALIDATION.TITLE_LENGTH),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage(MESSAGES.VALIDATION.DESCRIPTION_LENGTH),
  body("status")
    .optional()
    .isIn(TASK_STATUS_LIST)
    .withMessage(MESSAGES.VALIDATION.STATUS_INVALID),
  body("assignedTo")
    .optional()
    .isMongoId()
    .withMessage(MESSAGES.VALIDATION.ASSIGNED_TO_INVALID),
];

export const taskIdValidation = [
  param("taskId").isMongoId().withMessage(MESSAGES.VALIDATION.TASK_ID_INVALID),
];

export const listTaskValidation = [
  query("status")
    .optional()
    .isIn(TASK_STATUS_LIST)
    .withMessage(MESSAGES.VALIDATION.STATUS_INVALID),
  query("assignedTo")
    .optional()
    .isMongoId()
    .withMessage(MESSAGES.VALIDATION.ASSIGNED_TO_INVALID),
  query("createdBy")
    .optional()
    .isMongoId()
    .withMessage(MESSAGES.VALIDATION.USER_ID_INVALID),
  query("page").optional().isInt({ min: 1 }).withMessage(MESSAGES.VALIDATION.PAGE_INVALID),
  query("limit")
    .optional()
    .isInt({ min: 1, max: MAX_LIMIT })
    .withMessage(MESSAGES.VALIDATION.LIMIT_INVALID),
];
