import express from "express";

export const viewsRouter = express.Router();

viewsRouter.get("/", (req, res) => {
  return res.status(200).render("index", {});
});
