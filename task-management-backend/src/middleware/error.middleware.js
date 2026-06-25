import { MESSAGES } from "../shared/constants/message.js";

export const asyncHandler = (controller) => (req, res, next) => {
  Promise.resolve(controller(req, res, next)).catch(next);
};

const errorMiddleware = (error, _req, res, _next) => {
  const statusCode = error.statusCode || error.status || 400;

  return res.status(statusCode).json({
    success: false,
    message: error.message || MESSAGES.APP.INTERNAL_SERVER_ERROR,
  });
};

export default errorMiddleware;
