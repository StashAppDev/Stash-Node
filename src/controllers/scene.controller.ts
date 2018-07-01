import { getManager } from "typeorm";
import { FindScenesQueryArgs, FindScenesResultType } from "typings/graphql";
import { SceneEntity } from "../entities/scene.entity";
import { SceneQueryBuilder } from "../querybuilders/scene.querybuilder";

export class SceneController {
  static async findScenes(args: FindScenesQueryArgs): Promise<FindScenesResultType> {
    const sceneRepository = getManager().getRepository(SceneEntity);
    var qb = sceneRepository.createQueryBuilder("scenes");

    const helper = new SceneQueryBuilder(qb, args);
    helper
      .filter()
      .sort(sceneRepository, 'title')
      .paginate();

    const results = await helper.qb.getManyAndCount();

    return { scenes: results[0], count: results[1] };
  }
}