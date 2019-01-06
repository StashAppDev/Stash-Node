import { Database } from "../db/database";
import { ITagAttributes, ITagInstance } from "../db/models/tag.model";
import { MutationResolvers, QueryResolvers } from "../typings/graphql";
import { getEntity } from "./utils";

export class TagController {
  // #region GraphQL Resolvers

  public static findTag: QueryResolvers.FindTagResolver = async (root, args, context, info) => {
    return getEntity<ITagInstance, ITagAttributes>(args.id);
  }

  public static tagCreate: MutationResolvers.TagCreateResolver = async (root, args, context, info) => {
    return Database.Tag.create(args.input);
  }

  public static tagUpdate: MutationResolvers.TagUpdateResolver = async (root, args, context, info) => {
    const tag = await getEntity<ITagInstance, ITagAttributes>(args.input.id);
    tag.name = args.input.name;
    return tag.save();
  }

  // #endregion
}
