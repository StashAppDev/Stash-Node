import express from "express";
import { SceneController } from "../controllers/scene.controller";
import { StashPaths } from "../stash/paths.stash";
import { Database } from "../db/database";
import { getEntity } from "../controllers/utils";

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
  try {
    res.type("text/vtt");
    const id = req.params.id_thumbs.replace("_thumbs", "");
    const scene = await getEntity(Database.Scene, { id, checksum: id });
    res.sendFile(StashPaths.sceneVttThumbsFilePath(scene!.checksum));
  } catch (e) {
    next(e);
  }
});

router.get("/:id_sprite.jpg", async (req, res, next) => {
  try {
    res.type("image/jpeg");
    const id = req.params.id_sprite.replace("_sprite", "");
    const scene = await getEntity(Database.Scene, { id, checksum: id });
    res.sendFile(StashPaths.sceneVttSpriteFilePath(scene!.checksum));
  } catch (e) {
    next(e);
  }
});

export default router;
