import { Router } from "express";
import { renderDashboardPage } from "../controllers/index.js";

const routes = Router();

routes.get("/", renderDashboardPage);

export default routes;
