import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import session from "express-session";
import passport from "passport";
import flash from "connect-flash";
import MongoStore from "connect-mongo";
import { configureSocketIO } from "./src/config/socket.js";
import routes from "./src/routes/index.js";
import connectDB from "./src/config/db.js";
import { mqttClient } from "./src/config/mqtt.js";
import "./src/config/passport.js";

const app = express();
const server = http.createServer(app); // Create HTTP server

connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/src/views"));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      httpOnly: true,
      secure: false, // For local dev
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); // Initialize connect-flash

const io = configureSocketIO(server);
app.locals.mqttClient = mqttClient;

app.use((req, res, next) => {
  console.log("Session ID:", req.sessionID);
  console.log("Session Data:", req.session);
  console.log("User in session:", req.user);
  console.log("User data from req.user:", req.user);
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

app.use(routes);

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.render("error", { message: error.message });
});

export { server, app, io };
