import { getManager } from "typeorm";
import { StudioEntity } from "../entities/studio.entity";
import { processImage } from "../stash/utils.stash";
import { StudioCreateInput, StudioUpdateInput } from "../typings/graphql";

export class StudioController {
  public static async find(id: string): Promise<StudioEntity | undefined> {
    const studioRepository = getManager().getRepository(StudioEntity);
    return studioRepository.findOne(id);
  }

  public static async create(input: StudioCreateInput): Promise<StudioEntity> {
    const studioRepository = getManager().getRepository(StudioEntity);
    const newStudio = studioRepository.create({
      name: input.name,
      url: input.url,
    });
    if (!!input.image) {
      processImage(input, newStudio);
    }
    return studioRepository.save(newStudio);
  }

  public static async update(input: StudioUpdateInput): Promise<StudioEntity> {
    const studioRepository = getManager().getRepository(StudioEntity);
    const studio = await studioRepository.findOneOrFail(input.id);
    studio.name = input.name;
    studio.url = input.url;
    if (!!input.image) {
      processImage(input, studio);
    }
    return studioRepository.save(studio);
  }
}
