import express from "express";
import fs from "fs";
import { Database } from "../db/database";
import { SceneQueryBuilder } from "../querybuilders/scene.querybuilder";
import { StashPaths } from "../stash/paths.stash";
import { QueryResolvers } from "../typings/graphql";
import { getEntity, getEntityByChecksum } from "./utils";

export class SceneController {
  public static findScene: QueryResolvers.FindSceneResolver = async (root, args, context, info) => {
    if (!!args.id) {
      return getEntity(Database.Scene, args.id);
    } else if (!!args.checksum) {
      return getEntityByChecksum(Database.Scene, args.checksum);
    } else {
      return;
    }
  }

  public static findScenes: QueryResolvers.FindScenesResolver = async (root, args, context, info) => {
    const helper = new SceneQueryBuilder(args);
    helper
      .filter()
      .sort("title")
      .paginate();

    const results = await Database.Scene.findAndCountAll(helper.opts);

    return { scenes: results.rows, count: results.count };
  }

  public static async stream(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      const scene = await getEntity(Database.Scene, req.params.id);
      res.sendFile(scene.path!);
    } catch (e) {
      next(e);
    }
  }

  public static async screenshot(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      const scene = await getEntity(Database.Scene, req.params.id);

      const screenshotPath = StashPaths.screenshotPath(scene.checksum!);
      const thumbnailPath = StashPaths.thumbnailScreenshotPath(scene.checksum!);

      const seconds = parseInt(req.query.seconds, 10);
      const width = parseInt(req.query.width, 10);

      const sendFileOptions = {
        maxAge: 604800000, // 1 Week
      };

      if (!!seconds) {
        // TODO
        //   data = @scene.screenshot(seconds: params[:seconds], width: params[:width])
        //   send_data data, filename: 'screenshot.jpg', disposition: 'inline'
      } else if (fs.existsSync(thumbnailPath) && !!width && width < 400) {
        res.sendFile(thumbnailPath, sendFileOptions);
      } else {
        res.sendFile(screenshotPath, sendFileOptions);
      }
    } catch (e) {
      next(e);
    }
  }

  public static async preview(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      const scene = await getEntity(Database.Scene, req.params.id);
      const previewPath = StashPaths.previewPath(scene.checksum!);

      const sendFileOptions = {
        maxAge: 604800000, // 1 Week
      };

      res.sendFile(previewPath, sendFileOptions);
    } catch (e) {
      next(e);
    }
  }

  public static async webp(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      const scene = await getEntity(Database.Scene, req.params.id);
      const webpPath = StashPaths.previewPath(scene.checksum!);

      const sendFileOptions = {
        maxAge: 604800000, // 1 Week
      };

      res.sendFile(webpPath, sendFileOptions);
    } catch (e) {
      next(e);
    }
  }

  // public static async preview(req: express.Request, res: express.Response, next: express.NextFunction) {
  //   try {
  //   } catch (e) {
  //     next(e);
  //   }
  // }
}
