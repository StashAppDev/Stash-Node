import express from "express";
import FileType from "file-type";
import { Performer } from "../db/models/performer.model";
import { PerformerQueryBuilder } from "../querybuilders/performer.querybuilder";
import { QueryResolvers } from "../typings/graphql";
import { getEntity } from "./utils";

export class PerformerController {

  // #region GraphQL Resolvers

  public static findPerformer: QueryResolvers.FindPerformerResolver = async (root, args, context, info) => {
    return getEntity(Performer, { id: args.id });
  }

  public static findPerformers: QueryResolvers.FindPerformersResolver = async (root, args, context, info) => {
    const builder = new PerformerQueryBuilder(args);
    builder.filter();
    builder.search();
    builder.sort("name");

    const pages = await builder.paginate();
    const totalSize = await builder.resultSize();

    // TODO: Model instance doesn't match the GQL interface... remove any?
    // https://github.com/dotansimha/graphql-code-generator/issues/1041
    return { performers: pages.results, count: totalSize } as any;
  }

  // #endregion

  public static async image(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      // if (req.fresh) { return; } // TODO

      const performer = await getEntity(Performer, { id: req.params.id });

      const fileType = FileType(performer.image!);
      if (fileType == null) { throw Error(`Unable to find file type for performer image ${performer.id}`); }

      res.type(fileType.mime);
      res.setHeader("Cache-Control", "public, max-age=604800000"); // 1 Week
      res.send(performer.image);
    } catch (e) {
      next(e);
    }
  }
}
