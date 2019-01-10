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
  identifier: { id?: string, checksum?: string },
): Promise<TInstance> {
  let entity: TInstance | null = null;
  if (!!identifier.id) {
    entity = await model.findOne({ where: { id: identifier.id } } as any);
  }
  if (!entity && !!identifier.checksum) {
    entity = await model.findOne({ where: { checksum: identifier.checksum } } as any);
  }

  if (!entity) {
    const message = `Unable to find ${model.name} with identifer ${identifier}`;
    log.warn(message);
    throw new HttpError(404, message);
  }
  return entity;
}
