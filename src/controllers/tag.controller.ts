import { getManager } from "typeorm";
import { TagEntity } from "../entities/tag.entity";
import { MutationResolvers, QueryResolvers } from "../typings/graphql";

export class TagController {
  // #region GraphQL Resolvers

  public static findTag: QueryResolvers.FindTagResolver = async (root, args, context, info) => {
    const tagRepository = getManager().getRepository(TagEntity);
    return tagRepository.findOne(args.id);
  }

  public static tagCreate: MutationResolvers.TagCreateResolver = async (root, args, context, info) => {
    const tagRepository = getManager().getRepository(TagEntity);
    const newTag = tagRepository.create(args.input);
    return tagRepository.save(newTag);
  }

  public static tagUpdate: MutationResolvers.TagUpdateResolver = async (root, args, context, info) => {
    const tagRepository = getManager().getRepository(TagEntity);
    const tag = await tagRepository.findOneOrFail(args.input.id);
    tag.name = args.input.name;
    return tagRepository.save(tag);
  }

  // #endregion
}
