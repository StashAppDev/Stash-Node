import express from "express";
import fs from "fs";
import path from "path";
import { getManager } from "typeorm";
import { SceneEntity } from "../entities/scene.entity";
import { log } from "../logger";
import { SceneQueryBuilder } from "../querybuilders/scene.querybuilder";
import { StashManager } from "../stash/manager.stash";
import { StashPaths } from "../stash/paths.stash";
import { FindScenesQueryArgs, FindScenesResultType } from "../typings/graphql";

export class SceneController {
  public static async findScenes(root: any, args: FindScenesQueryArgs, context: any) {
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

  public static async stream(req: express.Request, res: express.Response) {
    const scene = await this.getScene(req, res);
    if (scene === undefined) { return; }

    res.sendFile(scene.path);
  }

  public static async screenshot(req: express.Request, res: express.Response) {
    const scene = await this.getScene(req, res);
    if (scene === undefined) { return; }

    const screenshotPath = path.join(StashPaths.screenshots, `${scene.checksum}.jpg`);
    const thumbnailPath = path.join(StashPaths.screenshots, `${scene.checksum}.thumb.jpg`);

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
  }

  /**
   * Will send the status code if given a response.  Return if the result is undefined.
   */
  private static async getScene(req: express.Request, res?: express.Response): Promise<SceneEntity|undefined> {
    const sceneRepository = getManager().getRepository(SceneEntity);
    const id = req.params.id;
    const scene = await sceneRepository.findOne(id);
    if (scene === undefined && res !== undefined) {
      log.warn(`${req.url}: Unabled to find scene with id ${id}`);
      res.sendStatus(404);
    }
    return scene;
  }
}
