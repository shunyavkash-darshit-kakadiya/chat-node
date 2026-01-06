import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import Message from "../models/message.model.js";
import { CLIENT_URL, APP_JWT_SECRET } from "./environment.config.js";

let io;
const onlineUsers = new Map(); // userId -> socketId

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: CLIENT_URL,
      credentials: true, //Cookies allow
    },
  });

  // Socket Auth middleware
  io.use((socket, next) => {
    try {
      const cookie = socket.handshake.headers.cookie;
      if (!cookie) return next(new Error("Unauthorized"));

      const token = cookie
        .split("; ")
        .find((c) => c.startsWith("authToken="))
        ?.split("=")[1];

      if (!token) return next(new Error("Token missing"));
      // console.log("Socket Token===>", token);

      const decoded = jwt.verify(token, APP_JWT_SECRET);
      socket.userId = decoded._id;

      next();
    } catch (err) {
      next(new Error("Unauthorized"));
    }
  });

  // connection
  io.on("connection", (socket) => {
    // console.log("socket.userId==>", socket.userId);
    onlineUsers.set(socket.userId, socket.id);
    // console.log("Online users==>", Array.from(onlineUsers.entries()));

    // Send Message
    socket.on("send_message", async ({ to, message }) => {
      console.log("send_message payload===>", { to, message });
      if (!to || !message) return;

      try {
        // 1. save message in DB
        const newMessage = await Message.create({
          senderId: socket.userId,
          receiverId: to,
          message,
          delivered: onlineUsers.has(to),
        });

        // 2. emit to receiver if online
        const receiverSocketId = onlineUsers.get(to);

        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receive_message", newMessage);
        }
      } catch (err) {
        console.error("Message error:", err);
      }
    });

    socket.on("disconnect", () => {
      onlineUsers.delete(socket.userId);
      console.log("User disconnected==>", socket.userId);
    });
  });

  return io;
};

export const getIO = () => io;
