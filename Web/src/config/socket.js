import { Server as HttpServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { mqttClient } from "./mqtt.js";

let io;

export const configureSocketIO = (server) => {
  io = new SocketIOServer(server);

  io.on("connection", (socket) => {
    socket.on("toggle_misting_fan", () => {
      console.log("Toggle misting fan");
      mqttClient.publish("22127406/FAN", "toggle");
    });

    socket.on("change_led_value", (data) => {
      console.log("Change led value");
      const { led_val } = data;
      mqttClient.publish("22127406/LED_VALUE", led_val.toString());
    });

    socket.on("toggle_auto_led", (data) => {
      console.log("Toggle auto led");
      const { auto_led } = data;
      console.log(auto_led);
      mqttClient.publish("22127406/AUTO_LED", auto_led ? "1" : "0");
    });

    socket.on("disconnect", () => {});
  });

  return io;
};
