import { Database } from "../db/database";
import { QueryResolvers } from "../typings/graphql";
import { getEntity } from "./utils";

export class GalleryController {

  // #region GraphQL Resolvers

  public static findGallery: QueryResolvers.FindGalleryResolver = async (root, args, context, info) => {
    return getEntity(Database.Gallery, { id: args.id });
  }

  // #endregion
}
