import { Router } from "express";
import mqttClient from "../config/mqtt.js";

const routes = Router();

routes.get("/", async (req, res) => {
  mqttClient.publish(process.env.TOPIC, "Hello world!");
  res.render("layouts/main-layout");
});

export default routes;
