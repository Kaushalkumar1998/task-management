import { Server } from "socket.io";
import { MESSAGES } from "../shared/constants/message.js";

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`Socket Connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`Socket Disconnected: ${socket.id}`);
    });
  });
};

export const getIO = () => {
  if (!io) {
    throw new Error(MESSAGES.SOCKET.NOT_INITIALIZED);
  }

  return io;
};
