import { Server } from "socket.io";
import { CLIENT_URL } from "./environment.config.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: CLIENT_URL || "http://localhost:7000",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected :", socket.id);

    socket.on("disconnect", () => {
      console.log("User disconnected :", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
