import express from "express";
import { getManager } from "typeorm";
import { StudioEntity } from "../entities/studio.entity";
import { processImage } from "../stash/utils.stash";
import { MutationResolvers, QueryResolvers } from "../typings/graphql";
import { getEntity } from "./utils";

export class StudioController {

  // #region GraphQL Resolvers

  public static findStudio: QueryResolvers.FindStudioResolver = async (root, args, context, info) => {
    const studioRepository = getManager().getRepository(StudioEntity);
    return studioRepository.findOne(args.id);
  }

  public static studioCreate: MutationResolvers.StudioCreateResolver = async (root, args, context, info) => {
    const studioRepository = getManager().getRepository(StudioEntity);
    const newStudio = studioRepository.create({
      name: args.input.name,
      url: args.input.url,
    });
    if (!!args.input.image) {
      processImage(args.input, newStudio);
    }
    return studioRepository.save(newStudio);
  }

  public static studioUpdate: MutationResolvers.StudioUpdateResolver = async (root, args, context, info) => {
    const studioRepository = getManager().getRepository(StudioEntity);
    const studio = await studioRepository.findOneOrFail(args.input.id);
    studio.name = args.input.name;
    studio.url = args.input.url;
    if (!!args.input.image) {
      processImage(args.input, studio);
    }
    return studioRepository.save(studio);
  }

  // #endregion

  public static async image(req: express.Request, res: express.Response) {
    const studio = await getEntity(StudioEntity, req, res);
    if (studio === undefined) { return; }

    // TODO

    // const sendFileOptions = {
    //   maxAge: 604800000, // 1 Week
    // };

    res.type("jpg");
    res.send(studio.image);
  }
}
