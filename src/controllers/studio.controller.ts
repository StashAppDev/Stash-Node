import express from "express";
import FileType from "file-type";
import { Studio } from "../db/models/studio.model";
import { MutationResolvers, QueryResolvers } from "../typings/graphql";
import { ImageUtils } from "../utils/image.utils";
import { getEntity } from "./utils";

export class StudioController {

  // #region GraphQL Resolvers

  public static findStudio: QueryResolvers.FindStudioResolver = async (root, args, context, info) => {
    return getEntity(Studio, { id: args.id });
  }

  public static studioCreate: MutationResolvers.StudioCreateResolver = async (root, args, context, info) => {
    const newStudio: Partial<Studio> = {
      name: args.input.name,
      url: args.input.url,
    };
    if (!!args.input.image) {
      await ImageUtils.processBase64Image(args.input, newStudio);
    }
    return Studio.query().insert(newStudio);
  }

  public static studioUpdate: MutationResolvers.StudioUpdateResolver = async (root, args, context, info) => {
    // TODO: check what happens if an input variable is undefined
    const updatedStudio: Partial<Studio> = {
      name: args.input.name,
      url: args.input.url,
    };
    if (!!args.input.image) {
      await ImageUtils.processBase64Image(args.input, updatedStudio);
    }
    return Studio.query().updateAndFetchById(args.input.id, updatedStudio);
  }

  // #endregion

  public static async image(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      // if (req.fresh) { return; } // TODO

      const studio = await getEntity(Studio, { id: req.params.id });

      const fileType = FileType(studio.image!);
      if (fileType == null) { throw Error(`Unable to find file type for studio image ${studio.id}`); }

      res.type(fileType.mime);
      res.setHeader("Cache-Control", "public, max-age=604800000"); // 1 Week
      res.send(studio.image);
    } catch (e) {
      next(e);
    }
  }
}
