import { Model } from "objection";
import { HttpError } from "../errors/http.error";
import { log } from "../logger";

/**
 * Fetch an entity of the given type.
 *
 * @param id The id of the entity
 */
export async function getEntity<T extends Model>(
  type: new() => T,
  identifier: { id?: string, checksum?: string },
): Promise<T> {
  let entity: T | undefined;
  if (!!identifier.id) {
    entity = await (type as any).query().findById(identifier.id);
  }
  if (!entity && !!identifier.checksum) {
    entity = await (type as any).query().findOne({ checksum: identifier.checksum });
  }

  if (!entity) {
    const message = `Unable to find ${type.name} with identifer ${identifier}`;
    log.warn(message);
    throw new HttpError(404, message);
  }
  return entity;
}
