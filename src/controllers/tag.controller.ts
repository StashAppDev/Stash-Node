import { getManager } from "typeorm";
import { TagEntity } from "../entities/tag.entity";

export class TagController {
  public static async find(id: string): Promise<TagEntity> {
    const tagRepository = getManager().getRepository(TagEntity);
    return tagRepository.findOne(id);
  }

  public static async create(input: {name: string}): Promise<TagEntity> {
    const tagRepository = getManager().getRepository(TagEntity);
    const newTag = tagRepository.create(input);
    return tagRepository.save(newTag);
  }
}
