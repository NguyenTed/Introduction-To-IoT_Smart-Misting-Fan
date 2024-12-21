import { Server as HttpServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";

let io;

export const configureSocketIO = (server) => {
  io = new SocketIOServer(server);

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });

  return io;
};
