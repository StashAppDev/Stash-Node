import express from "express";
import { getManager } from "typeorm";
import { StudioEntity } from "../entities/studio.entity";
import { log } from "../logger";
import { processImage } from "../stash/utils.stash";
import { StudioCreateInput, StudioUpdateInput } from "../typings/graphql";

export class StudioController {
  public static async find(id: string): Promise<StudioEntity | undefined> {
    const studioRepository = getManager().getRepository(StudioEntity);
    return studioRepository.findOne(id);
  }

  public static async create(input: StudioCreateInput): Promise<StudioEntity> {
    const studioRepository = getManager().getRepository(StudioEntity);
    const newStudio = studioRepository.create({
      name: input.name,
      url: input.url,
    });
    if (!!input.image) {
      processImage(input, newStudio);
    }
    return studioRepository.save(newStudio);
  }

  public static async update(input: StudioUpdateInput): Promise<StudioEntity> {
    const studioRepository = getManager().getRepository(StudioEntity);
    const studio = await studioRepository.findOneOrFail(input.id);
    studio.name = input.name;
    studio.url = input.url;
    if (!!input.image) {
      processImage(input, studio);
    }
    return studioRepository.save(studio);
  }

  public static async image(req: express.Request, res: express.Response) {
    const studio = await this.getStudio(req, res);
    if (studio === undefined) { return; }

    // const sendFileOptions = {
    //   maxAge: 604800000, // 1 Week
    // };

    res.type("jpg");
    res.send(studio.image);
  }

  // TODO: duplicated
  /**
   * Will send the status code if given a response.  Return if the result is undefined.
   */
  private static async getStudio(req: express.Request, res?: express.Response): Promise<StudioEntity|undefined> {
    const studioRepository = getManager().getRepository(StudioEntity);
    const id = req.params.id;
    const studio = await studioRepository.findOne(id);
    if (studio === undefined && res !== undefined) {
      log.warn(`${req.url}: Unabled to find studio with id ${id}`);
      res.sendStatus(404);
    }
    return studio;
  }
}
