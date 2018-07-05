import { getManager } from "typeorm";
import { StudioEntity } from "../entities/studio.entity";
import { StudioCreateInput, StudioUpdateInput } from "../typings/graphql";

export class StudioController {
  public static async find(id: string): Promise<StudioEntity | undefined> {
    const studioRepository = getManager().getRepository(StudioEntity);
    return studioRepository.findOne(id);
  }

  public static async create(input: StudioCreateInput): Promise<StudioEntity> {
    const studioRepository = getManager().getRepository(StudioEntity);
    const newStudio = studioRepository.create(input);
    return studioRepository.save(newStudio);
  }

  public static async update(input: StudioUpdateInput): Promise<StudioEntity> {
    const studioRepository = getManager().getRepository(StudioEntity);
    const studio = await studioRepository.findOneOrFail(input.id);
    studio.name = input.name;
    studio.url = input.url;
    if (!!input.image) {
      studio.image = input.image;
    }
    return studioRepository.save(studio);
  }
}
