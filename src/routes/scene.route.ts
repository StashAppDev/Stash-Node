import express from "express";
import { SceneController } from "../controllers/scene.controller";

const router = express.Router();

// router.use(function timeLog(req, res, next) {
//   log.info(`Time:  ${Date.now()}`);
//   next();
// });

router.get("/:id/stream", (req, res) => {
  SceneController.stream(req, res);
});

router.get("/:id/screenshot", (req, res) => {
  SceneController.screenshot(req, res);
});

export default router;
