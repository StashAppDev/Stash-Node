import express from "express";
import { StudioController } from "../controllers/studio.controller";
import { log } from "../logger";

const router = express.Router();

router.get("/:id/image", (req, res) => {
  StudioController.image(req, res);
});

export default router;
