import express from "express";
import FileType from "file-type";
import { Performer } from "../db/models/performer.model";
import { PerformerQueryBuilder } from "../querybuilders/performer.querybuilder";
import { MutationResolvers, PerformerCreateInput, PerformerUpdateInput, QueryResolvers } from "../typings/graphql";
import { ImageUtils } from "../utils/image.utils";
import { ObjectionUtils } from "../utils/objection.utils";

export class PerformerController {

  // #region GraphQL Resolvers

  public static findPerformer: QueryResolvers.FindPerformerResolver = async (root, args, context, info) => {
    return ObjectionUtils.getEntity(Performer, { id: args.id });
  }

  public static findPerformers: QueryResolvers.FindPerformersResolver = async (root, args, context, info) => {
    const builder = new PerformerQueryBuilder(args);
    builder.filter();
    builder.search();
    builder.sort("name");

    const page = await builder.paginate();
    // TODO: Model instance doesn't match the GQL interface... remove any?
    // https://github.com/dotansimha/graphql-code-generator/issues/1041
    return { performers: page.results, count: page.total } as any;
  }

  public static performerCreate: MutationResolvers.PerformerCreateResolver = async (root, args, context, info) => {
    const newPerformer = await PerformerController.makePartialPerformer(args.input);
    return Performer.query().insert(newPerformer);
  }

  public static performerUpdate: MutationResolvers.PerformerUpdateResolver = async (root, args, context, info) => {
    const updatedPerformer = await PerformerController.makePartialPerformer(args.input);
    return Performer.query().updateAndFetchById(args.input.id, updatedPerformer);
  }

  // #endregion

  public static async image(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      // if (req.fresh) { return; } // TODO

      const performer = await ObjectionUtils.getEntity(Performer, { id: req.params.id });

      const fileType = FileType(performer.image!);
      if (fileType == null) { throw Error(`Unable to find file type for performer image ${performer.id}`); }

      res.type(fileType.mime);
      res.setHeader("Cache-Control", "public, max-age=604800000"); // 1 Week
      res.send(performer.image);
    } catch (e) {
      next(e);
    }
  }

  private static async makePartialPerformer(input: PerformerUpdateInput | PerformerCreateInput) {
    const performer: Partial<Performer> = {
      name          : input.name,
      url           : input.url,
      birthdate     : input.birthdate,
      ethnicity     : input.ethnicity,
      country       : input.country,
      eye_color     : input.eye_color,
      height        : input.height,
      measurements  : input.measurements,
      fake_tits     : input.fake_tits,
      career_length : input.career_length,
      tattoos       : input.tattoos,
      piercings     : input.piercings,
      aliases       : input.aliases,
      twitter       : input.twitter,
      instagram     : input.instagram,
      favorite      : input.favorite || false,
    };
    if (!!input.image) {
      await ImageUtils.processBase64Image(input, performer);
    }
    return performer;
  }
}
