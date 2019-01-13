import { Model, QueryBuilder } from "objection";
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
  const qb = QueryBuilder.forClass(type as any);
  if (!!identifier.id) {
    entity = await qb.findById(identifier.id) as any;
  }
  if (!entity && !!identifier.checksum) {
    entity = await qb.findOne({ checksum: identifier.checksum }) as any;
  }

  if (!entity) {
    const message = `Unable to find ${type.name} with identifer ${identifier}`;
    log.warn(message);
    throw new HttpError(404, message);
  }
  return entity;
}
