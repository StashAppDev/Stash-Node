// tslint:disable:object-literal-sort-keys variable-name
import { Model, QueryBuilder } from "objection";
import path from "path";
import BaseModel from "./base.model";
import { Scene } from "./scene.model";
import { Stash } from "../../stash/stash";

export class Gallery extends BaseModel {
  public static tableName = "galleries";

  public static jsonSchema = {
    type: "object",
    required: ["path", "checksum"],

    properties: {
      id: { type: "integer" },
      path: { type: "string" },
      checksum: { type: "string" },
      scene_id: { type: ["integer", "null"] },
      created_at: { type: "string" },
      updated_at: { type: "string" },
    },
  };

  public static relationMappings = {
    scene: {
      relation: Model.BelongsToOneRelation,
      modelClass: path.join(__dirname, "scene.model"),
      join: {
        from: "galleries.scene_id",
        to: "scenes.id",
      },
    },
  };

  public static modifiers = {
    unowned: (builder: QueryBuilder<Gallery>) => builder.whereNull("scene_id"),
  };

  public readonly id: number;
  public path: string;
  public checksum: string;
  public scene_id?: number;

  // Optional eager relations.
  public scene?: Scene;

  public async getFiles() {
    return await Stash.zip.getFiles(this);
  }
}
