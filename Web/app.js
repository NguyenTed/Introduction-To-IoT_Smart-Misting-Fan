import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import routes from "./src/routes/index.js";
import connectDB from "./src/config/db.js";
import { mqttClient } from "./src/config/mqtt.js";

const app = express();
const server = http.createServer(app);

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/src/views"));

app.locals.mqttClient = mqttClient;

app.use(routes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.render("error", { message: error.message });
});

export default app;
