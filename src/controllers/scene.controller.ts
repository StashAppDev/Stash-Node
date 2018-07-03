import express from "express";
import { getManager } from "typeorm";
import { FindScenesQueryArgs, FindScenesResultType } from "typings/graphql";
import { SceneEntity } from "../entities/scene.entity";
import { SceneQueryBuilder } from "../querybuilders/scene.querybuilder";

export class SceneController {
  public static async findScenes(args: FindScenesQueryArgs): Promise<FindScenesResultType> {
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
    const sceneRepository = getManager().getRepository(SceneEntity);
    const id = req.params.id;
    const scene = await sceneRepository.findOne(id);
    res.sendFile(scene.path);
  }
}
