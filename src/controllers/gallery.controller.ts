import { Gallery } from "../db/models/gallery.model";
import { QueryResolvers } from "../typings/graphql";
import { getEntity } from "./utils";

export class GalleryController {

  // #region GraphQL Resolvers

  public static findGallery: QueryResolvers.FindGalleryResolver = async (root, args, context, info) => {
    return getEntity(Gallery, { id: args.id });
  }

  // #endregion
}
