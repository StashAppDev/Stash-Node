import express = require("express");
import { getManager } from "typeorm";
import { log } from "../logger";

/**
 * Fetch an entity of the given type.
 *
 * @param type The entity type
 * @param req the express request
 * @param res the express response
 */
export async function getEntity<T>(
  type: new() => T, // https://stackoverflow.com/a/38311757
  req: express.Request,
  res?: express.Response,
): Promise<T|undefined> {
  const repository = getManager().getRepository(type.name);
  const id = req.params.id;
  const entity = await repository.findOne(id);
  if (entity === undefined && res !== undefined) {
    log.warn(`${req.url}: Unable to find ${type.name} with id ${id}`);
    res.sendStatus(404);
  }
  return entity as T;
}
