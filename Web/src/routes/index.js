import { Router } from "express";

const routes = Router();

routes.get("/", async (req, res) => {
  res.render("layouts/main-layout");
});

export default routes;
