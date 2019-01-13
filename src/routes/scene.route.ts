import express from "express";
import { SceneMarkerController } from "../controllers/scene-marker.controller";
import { SceneController } from "../controllers/scene.controller";

const router = express.Router();

// router.use(function timeLog(req, res, next) {
//   log.info(`Time:  ${Date.now()}`);
//   next();
// });

router.get("/:id/stream(.mp4)?", (req, res, next) => {
  SceneController.stream(req, res, next);
});

router.get("/:id/screenshot", (req, res, next) => {
  SceneController.screenshot(req, res, next);
});

router.get("/:id/preview", (req, res, next) => {
  SceneController.preview(req, res, next);
});

router.get("/:id/webp", (req, res, next) => {
  SceneController.webp(req, res, next);
});

router.get("/:id/vtt/chapter", (req, res, next) => {
  SceneController.chapterVtt(req, res, next);
});

router.get("/:id_thumbs.vtt", async (req, res, next) => {
  SceneController.vttThumbs(req, res, next);
});

router.get("/:id_sprite.jpg", async (req, res, next) => {
  SceneController.vttSprite(req, res, next);
});

router.get("/:scene_id/scene_markers/:id/stream", (req, res, next) => {
  SceneMarkerController.stream(req, res, next);
});

router.get("/:scene_id/scene_markers/:id/preview", (req, res, next) => {
  SceneMarkerController.preview(req, res, next);
});

export default router;
