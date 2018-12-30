import { getManager } from "typeorm";
import { TagEntity } from "../entities/tag.entity";
import { TagCreateInput, TagUpdateInput } from "../typings/graphql";

export class TagController {
  public static async find(id: string): Promise<TagEntity | undefined> {
    const tagRepository = getManager().getRepository(TagEntity);
    return tagRepository.findOne(id);
  }

  public static async create(input: TagCreateInput): Promise<TagEntity> {
    const tagRepository = getManager().getRepository(TagEntity);
    const newTag = tagRepository.create(input);
    return tagRepository.save(newTag);
  }

  public static async update(input: TagUpdateInput): Promise<TagEntity> {
    const tagRepository = getManager().getRepository(TagEntity);
    const tag = await tagRepository.findOneOrFail(input.id);
    tag.name = input.name;
    return tagRepository.save(tag);
  }
}
