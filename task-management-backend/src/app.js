import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import errorMiddleware from "./middleware/error.middleware.js";
import { MESSAGES } from "./shared/constants/message.js";
import authRoutes from "./modules/auth/auth.routes.js";
import taskRoutes from "./modules/tasks/task.routes.js";
import userRoutes from "./modules/users/user.routes.js";

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  }),
);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: MESSAGES.APP.HEALTH_OK,
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: MESSAGES.APP.ROUTE_NOT_FOUND(req.method, req.originalUrl),
  });
});

app.use(errorMiddleware);

export default app;
