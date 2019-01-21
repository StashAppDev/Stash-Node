import { Tag } from "../db/models/tag.model";
import { MutationResolvers, QueryResolvers } from "../typings/graphql";
import { ObjectionUtils } from "../utils/objection.utils";

export class TagController {
  // #region GraphQL Resolvers

  public static findTag: QueryResolvers.FindTagResolver = async (root, args, context, info) => {
    return ObjectionUtils.getEntity(Tag, { id: args.id });
  }

  public static tagCreate: MutationResolvers.TagCreateResolver = async (root, args, context, info) => {
    return Tag.query().insert(args.input); // TODO: unsafe
  }

  public static tagDestroy: MutationResolvers.TagDestroyResolver = async (root, args, context, info) => {
    const numberOfRows = await Tag.query().deleteById(args.input.id);
    return numberOfRows === 1;
  }

  public static tagUpdate: MutationResolvers.TagUpdateResolver = async (root, args, context, info) => {
    return Tag.query().updateAndFetchById(args.input.id, { name: args.input.name });
  }

  // #endregion
}
