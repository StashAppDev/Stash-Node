import express from "express";
import { PerformerController } from "../controllers/performer.controller";

const router = express.Router();

router.get("/:id/image", (req, res, next) => {
  PerformerController.image(req, res, next);
});

export default router;
