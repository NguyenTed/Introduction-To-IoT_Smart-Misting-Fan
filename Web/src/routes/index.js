import { Router } from "express";
import { renderDashboardPage } from "../controllers/index.js";
import authRouter from "./auth.js";

const routes = Router();

routes.get("/", renderDashboardPage);
routes.use("/users", authRouter);

export default routes;
