import { Server as HttpServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { mqttClient } from "./mqtt.js";

let io;

export const configureSocketIO = (server) => {
  io = new SocketIOServer(server);

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("toggle_misting_fan", () => {
      console.log("Toggle misting fan");
      mqttClient.publish("22127406/FAN", "testing");
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });

  return io;
};
