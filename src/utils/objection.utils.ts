import { Model, QueryBuilder } from "objection";
import { HttpError } from "../errors/http.error";
import { log } from "../logger";

export class ObjectionUtils {
  /**
   * Fetch an entity of the given type.
   *
   * @param id The id of the entity
   */
  public static async getEntity<T extends Model>(
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

  public static async getCount<T extends Model>(type: new() => T): Promise<number> {
    return this.getCountFromQueryBuilder((type as any).query());
  }
  public static async getCountFromQueryBuilder(qb: QueryBuilder<any>): Promise<number> {
    const count = await qb.count();
    if (count.length !== 1) { return 0; }
    return count[0]["count(*)"];
  }
}
