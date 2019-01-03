import express from "express";
import fs from "fs";
import { getManager } from "typeorm";
import { SceneEntity } from "../entities/scene.entity";
import { SceneQueryBuilder } from "../querybuilders/scene.querybuilder";
import { StashPaths } from "../stash/paths.stash";
import { QueryResolvers } from "../typings/graphql";
import { getEntity } from "./utils";

export class SceneController {
  public static findScenes: QueryResolvers.FindScenesResolver = async (root, args, context, info) => {
    const sceneRepository = getManager().getRepository(SceneEntity);
    const qb = sceneRepository.createQueryBuilder("scenes");

    const helper = new SceneQueryBuilder(qb, args);
    helper
      .filter()
      .sort(sceneRepository, "title")
      .paginate();

    const results = await helper.qb.getManyAndCount();

    return { scenes: results[0], count: results[1] };
  }

  public static async stream(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      const scene = await getEntity(SceneEntity, req.params.id);
      res.sendFile(scene.path);
    } catch (e) {
      next(e);
    }
  }

  public static async screenshot(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      const scene = await getEntity(SceneEntity, req.params.id);

      const screenshotPath = StashPaths.screenshotPath(scene.checksum);
      const thumbnailPath = StashPaths.thumbnailScreenshotPath(scene.checksum);

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
}
