import { getManager } from "typeorm";
import { HttpError } from "../errors/http.error";
import { log } from "../logger";

/**
 * Fetch an entity of the given type.
 *
 * @param type The entity type
 * @param id The id of the entity
 */
export async function getEntity<T>(
  type: new() => T, // https://stackoverflow.com/a/38311757
  id: string,
): Promise<T> {
  const repository = getManager().getRepository(type.name);
  const entity = await repository.findOne(id);
  if (entity === undefined) {
    const message = `Unable to find ${type.name} with id ${id}`;
    log.warn(message);
    throw new HttpError(404, message);
  }
  return entity as T;
}
