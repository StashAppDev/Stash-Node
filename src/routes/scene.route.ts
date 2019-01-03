import express from "express";
import { SceneController } from "../controllers/scene.controller";

const router = express.Router();

// router.use(function timeLog(req, res, next) {
//   log.info(`Time:  ${Date.now()}`);
//   next();
// });

router.get("/:id/stream", (req, res, next) => {
  SceneController.stream(req, res, next);
});

router.get("/:id/screenshot", (req, res, next) => {
  SceneController.screenshot(req, res, next);
});

export default router;
