import Sequelize from "sequelize";
import { HttpError } from "../errors/http.error";
import { log } from "../logger";

/**
 * Fetch an entity of the given type.
 *
 * @param id The id of the entity
 */
export async function getEntity<TInstance, TAttributes>(
  model: Sequelize.Model<TInstance, TAttributes>,
  id: string,
): Promise<TInstance> {
  const entity = await model.findOne({ where: { id } } as any);
  if (!entity) {
    const message = `Unable to find entity with id ${id}`;
    log.warn(message);
    throw new HttpError(404, message);
  }
  return entity;
}

/**
 * Fetch an entity of the given type.
 *
 * @param checksum The checksum of the entity
 */
export async function getEntityByChecksum<TInstance, TAttributes>(
  model: Sequelize.Model<TInstance, TAttributes>,
  checksum: string,
): Promise<TInstance> {
  const entity = await model.findOne({ where: { checksum } } as any);
  if (!entity) {
    const message = `Unable to find entity with checksum ${checksum}`;
    log.warn(message);
    throw new HttpError(404, message);
  }
  return entity;
}
