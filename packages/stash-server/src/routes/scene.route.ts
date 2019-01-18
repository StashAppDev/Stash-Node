import express from "express";
import { URL } from "url";
import { SceneMarkerController } from "../controllers/scene-marker.controller";
import { SceneController } from "../controllers/scene.controller";
import { Scene } from "../db/models/scene.model";
import { IGraphQLContext } from "../server";
import { GQL } from "../typings/graphql";

export class SceneRoutes {
  public static buildRouter(): express.Router {
    const r = express.Router();
    r.get("/:id/stream(.mp4)?", (req, res, next) => { SceneController.stream(req, res, next); });
    r.get("/:id/screenshot", (req, res, next) => { SceneController.screenshot(req, res, next); });
    r.get("/:id/preview", (req, res, next) => { SceneController.preview(req, res, next); });
    r.get("/:id/webp", (req, res, next) => { SceneController.webp(req, res, next); });
    r.get("/:id/vtt/chapter", (req, res, next) => { SceneController.chapterVtt(req, res, next); });
    r.get("/:id_thumbs.vtt", (req, res, next) => { SceneController.vttThumbs(req, res, next); });
    r.get("/:id_sprite.jpg", (req, res, next) => { SceneController.vttSprite(req, res, next); });

    r.get("/:scene_id/scene_markers/:id/stream", (req, res, next) => { SceneMarkerController.stream(req, res, next); });
    r.get("/:scene_id/scene_markers/:id/preview", (req, res, next) => {
      SceneMarkerController.preview(req, res, next);
    });

    return r;
  }

  public static buildScenePaths(scene: Scene, context: IGraphQLContext): GQL.ScenePathsType {
    if (!scene.id) { return {}; }
    return {
      chapters_vtt: this.getChaptersVttUrl(context.baseUrl, scene.id),
      preview: this.getStreamPreviewUrl(context.baseUrl, scene.id),
      screenshot: this.getScreenshotUrl(context.baseUrl, scene.id),
      stream: this.getStreamUrl(context.baseUrl, scene.id),
      vtt: this.getSpriteVttUrl(context.baseUrl, scene.id),
      webp: this.getStreamPreviewImageUrl(context.baseUrl, scene.id),
    };
  }

  public static getStreamUrl(baseUrl: URL, sceneId: number) {
    return new URL(`/scenes/${sceneId}/stream.mp4`, baseUrl).toString();
  }

  public static getStreamPreviewUrl(baseUrl: URL, sceneId: number) {
    return new URL(`/scenes/${sceneId}/preview`, baseUrl).toString();
  }

  public static getStreamPreviewImageUrl(baseUrl: URL, sceneId: number) {
    return new URL(`/scenes/${sceneId}/webp`, baseUrl).toString();
  }

  public static getSpriteVttUrl(baseUrl: URL, sceneId: number) {
    return new URL(`/scenes/${sceneId}_thumbs.vtt`, baseUrl).toString();
  }

  public static getScreenshotUrl(baseUrl: URL, sceneId: number) {
    return new URL(`/scenes/${sceneId}/screenshot`, baseUrl).toString();
  }

  public static getChaptersVttUrl(baseUrl: URL, sceneId: number) {
    return new URL(`/scenes/${sceneId}/vtt/chapter`, baseUrl).toString();
  }

  public static getSceneMarkerStreamUrl(baseUrl: URL, sceneId: number, sceneMarkerId: number) {
    return new URL(`/scenes/${sceneId}/scene_markers/${sceneMarkerId}/stream`, baseUrl).toString();
  }

  public static getSceneMarkerStreamPreviewImageUrl(baseUrl: URL, sceneId: number, sceneMarkerId: number) {
    return new URL(`/scenes/${sceneId}/scene_markers/${sceneMarkerId}/preview`, baseUrl).toString();
  }
}
