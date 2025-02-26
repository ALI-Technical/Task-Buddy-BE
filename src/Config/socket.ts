import { Server } from "socket.io";
import { Server as HttpServer } from "http";

const adminSockets = new Set<string>();

let io: Server;

export const initSocket = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("disconnect", () => {
      adminSockets.delete(socket.id);
      console.log("User disconnected:", socket.id);
    });
  });
};

export { io };
