import { Database } from "../db/database";
import { HttpError } from "../errors/http.error";
import { log } from "../logger";

/**
 * Fetch an entity of the given type.
 *
 * @param id The id of the entity
 */
export async function getEntity<TInstance, TAttributes>(
  id: string,
): Promise<TInstance> {
  const entity = await Database.sequelize.Model.findOne<TAttributes>({ where: {id} }) as TInstance;
  if (!entity) {
    const message = `Unable to find entity with id ${id}`;
    log.warn(message);
    throw new HttpError(404, message);
  }
  return entity;
}
