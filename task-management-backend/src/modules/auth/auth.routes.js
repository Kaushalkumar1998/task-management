import express from "express";
import * as authController from "./auth.controller.js";
import { loginValidation, registerValidation } from "./auth.validation.js";
import { asyncHandler } from "../../middleware/error.middleware.js";
import validate from "../../middleware/validate.middleware.js";

const router = express.Router();

router.post("/login", loginValidation, validate, asyncHandler(authController.login));
router.post(
  "/register",
  registerValidation,
  validate,
  asyncHandler(authController.registerUser),
);
router.post("/logout", asyncHandler(authController.logout));

export default router;
