import { getManager } from "typeorm";
import { Tag } from "../entities/tag";

export class TagController {
  static async find(id: string): Promise<Tag> {
    const tagRepository = getManager().getRepository(Tag);
    return tagRepository.findOne(id);
  }

  static async create(input: {name: string}): Promise<Tag> {
    const tagRepository = getManager().getRepository(Tag);
    const newTag = tagRepository.create(input);
    return tagRepository.save(newTag);
  }
}