import express = require("express");
import { Gallery } from "../db/models/gallery.model";
import { GalleryQueryBuilder } from "../querybuilders/gallery.querybuilder";
import { QueryResolvers } from "../typings/graphql";
import { ObjectionUtils } from "../utils/objection.utils";

export class GalleryController {

  // #region GraphQL Resolvers

  public static findGallery: QueryResolvers.FindGalleryResolver = async (root, args, context, info) => {
    return ObjectionUtils.getEntity(Gallery, { id: args.id });
  }

  public static findGalleries: QueryResolvers.FindGalleriesResolver = async (root, args, context, info) => {
    const builder = new GalleryQueryBuilder(args);
    builder.filter();
    builder.search();
    builder.sort("path");

    const page = await builder.paginate();
    // TODO: Model instance doesn't match the GQL interface... remove any?
    // https://github.com/dotansimha/graphql-code-generator/issues/1041
    return { galleries: page.results, count: page.total } as any;
  }

  // #endregion

  public static async file(req: express.Request, res: express.Response, next: express.NextFunction) {
    // TODO

    // if stale?(@gallery)
    //   index = params[:index].to_i
    //   file = @gallery.files[index]
    //
    //   file_path = nil
    //   if params[:thumb]
    //     file_path = Stash::ZipUtility.get_thumbnail(gallery: @gallery, index: index)
    //   else
    //     file_path = Stash::ZipUtility.get_image(gallery: @gallery, index: index)
    //   end
    //
    //   raise ActionController::RoutingError.new('Not Found') unless file_path
    //
    //   expires_in 1.week
    //   response.headers['Content-Length'] = File.size(file_path).to_s
    //
    //   send_file file_path, filename: file.name, disposition: 'inline'
    // end
  }
}
