import express from "express";
import { StudioController } from "../controllers/studio.controller";

const router = express.Router();

router.get("/:id/image", (req, res, next) => {
  StudioController.image(req, res, next);
});

export default router;
