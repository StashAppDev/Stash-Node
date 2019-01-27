import express = require("express");
import { Gallery } from "../db/models/gallery.model";
import { GalleryQueryBuilder } from "../querybuilders/gallery.querybuilder";
import { Stash } from "../stash/stash";
import { QueryResolvers } from "../typings/graphql";
import { FileUtils } from "../utils/file.utils";
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
    try {
      // if (req.fresh) { return; } // TODO

      const gallery = await ObjectionUtils.getEntity(Gallery, { id: req.params.id });

      let imagePath: string = "invalid";
      if (req.query.thumb === "true") {
        imagePath = await Stash.zip.getThumbnail(gallery, req.params.fileIndex);
      } else {
        imagePath = await Stash.zip.getImage(gallery, req.params.fileIndex);
      }
      const imageExists = await FileUtils.fileExists(imagePath);
      if (!imageExists) { throw new Error(`Can't find gallery image ${imagePath}`); }

      const sendFileOptions = {
        maxAge: 604800000, // 1 Week
      };
      res.sendFile(imagePath, sendFileOptions);
    } catch (e) {
      next(e);
    }
  }
}
