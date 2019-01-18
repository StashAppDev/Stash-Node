import express from "express";
import { URL } from "url";
import { PerformerController } from "../controllers/performer.controller";

export class PerformerRoutes {
  public static buildRouter(): express.Router {
    const r = express.Router();
    r.get("/:id/image", (req, res, next) => { PerformerController.image(req, res, next); });
    return r;
  }

  public static getPerformerImageUrl(baseUrl: URL, performerId: number) {
    return new URL(`/performers/${performerId}/image`, baseUrl).toString();
  }
}
