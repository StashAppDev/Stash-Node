import express from "express";
import { URL } from "url";
import { StudioController } from "../controllers/studio.controller";

export class StudioRoutes {
  public static buildRouter(): express.Router {
    const r = express.Router();
    r.get("/:id/image", (req, res, next) => { StudioController.image(req, res, next); });
    return r;
  }

  public static getStudioImageUrl(baseUrl: URL, studioId: number) {
    return new URL(`/studios/${studioId}/image`, baseUrl).toString();
  }
}
