import express from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../middleware/error.middleware.js";
import authorize from "../../middleware/role.middleware.js";
import validate from "../../middleware/validate.middleware.js";
import { ROLES } from "../../shared/constants/enum.js";
import * as userController from "./user.controller.js";
import {
  createUserValidation,
  deleteUserValidation,
  listUsersValidation,
  teamLeadOverviewValidation,
  updateUserValidation,
} from "./user.validation.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", listUsersValidation, validate, asyncHandler(userController.getUsers));
router.get(
  "/team-leads/tasks",
  authorize(ROLES.MANAGER),
  teamLeadOverviewValidation,
  validate,
  asyncHandler(userController.getTeamLeadTaskOverview),
);
router.post(
  "/",
  authorize(ROLES.MANAGER, ROLES.TEAM_LEAD),
  createUserValidation,
  validate,
  asyncHandler(userController.registerUser),
);
router.patch(
  "/:userId",
  updateUserValidation,
  validate,
  asyncHandler(userController.updateUser),
);
router.delete(
  "/:userId",
  authorize(ROLES.MANAGER),
  deleteUserValidation,
  validate,
  asyncHandler(userController.deleteUser),
);

export default router;
