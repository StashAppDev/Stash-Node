import express from "express";
import { URL } from "url";
import { GalleryController } from "../controllers/gallery.controller";

export class GalleryRoutes {
  public static buildRouter(): express.Router {
    const r = express.Router();
    r.get("/:id/:fileIndex", (req, res, next) => { GalleryController.file(req, res, next); });
    return r;
  }

  public static getGalleryImageUrl(baseUrl: URL, galleryId: number, fileIndex: number) {
    return new URL(`/galleries/${galleryId}/${fileIndex}`, baseUrl).toString();
  }
}
