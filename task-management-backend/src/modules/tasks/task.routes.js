import express from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../middleware/error.middleware.js";
import authorize from "../../middleware/role.middleware.js";
import validate from "../../middleware/validate.middleware.js";
import { ROLES } from "../../shared/constants/enum.js";
import * as taskController from "./task.controller.js";
import {
  createTaskValidation,
  listTaskValidation,
  taskIdValidation,
  updateTaskValidation,
} from "./task.validation.js";

const router = express.Router();

router.use(authMiddleware);
router.use(authorize(ROLES.MANAGER, ROLES.TEAM_LEAD, ROLES.EMPLOYEE));

router.get("/", listTaskValidation, validate, asyncHandler(taskController.getTasks));
router.post("/", createTaskValidation, validate, asyncHandler(taskController.createTask));
router.patch(
  "/:taskId",
  updateTaskValidation,
  validate,
  asyncHandler(taskController.updateTask),
);
router.delete(
  "/:taskId",
  authorize(ROLES.MANAGER),
  taskIdValidation,
  validate,
  asyncHandler(taskController.deleteTask),
);

export default router;
