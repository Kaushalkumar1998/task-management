import dotenv from "dotenv";
import http from "http";
import app from "./app.js";
import connectDB from "./config/db.js";
import { initializeSocket } from "./config/socket.js";
import { MESSAGES } from "./shared/constants/message.js";

dotenv.config();

await connectDB();

const server = http.createServer(app);
initializeSocket(server);

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(MESSAGES.APP.SERVER_RUNNING(PORT));
});
