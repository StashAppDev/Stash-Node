import express from "express";
import FileType from "file-type";
import { Studio } from "../models/studio.model";
import { processImage } from "../stash/utils.stash";
import { MutationResolvers, QueryResolvers } from "../typings/graphql";
import { getEntity } from "./utils";

export class StudioController {

  // #region GraphQL Resolvers

  public static findStudio: QueryResolvers.FindStudioResolver = async (root, args, context, info) => {
    return getEntity(Studio, args.id);
  }

  public static studioCreate: MutationResolvers.StudioCreateResolver = async (root, args, context, info) => {
    const newStudio = Studio.build({
      name: args.input.name,
      url: args.input.url,
    });
    if (!!args.input.image) {
      processImage(args.input, newStudio);
    }
    return newStudio.save();
  }

  public static studioUpdate: MutationResolvers.StudioUpdateResolver = async (root, args, context, info) => {
    const studio = await getEntity(Studio, args.input.id);
    studio.name = args.input.name;
    studio.url = args.input.url;
    if (!!args.input.image) {
      processImage(args.input, studio);
    }
    return studio.save();
  }

  // #endregion

  public static async image(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      // if (req.fresh) { return; } // TODO

      const studio = await getEntity(Studio, req.params.id);

      const fileType = FileType(studio.image);
      if (fileType == null) { throw Error(`Unable to find file type for studio image ${studio.id}`); }

      res.type(fileType.mime);
      res.setHeader("Cache-Control", "public, max-age=604800000"); // 1 Week
      res.send(studio.image);
    } catch (e) {
      next(e);
    }
  }
}
