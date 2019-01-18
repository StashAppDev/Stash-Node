// tslint:disable:object-literal-sort-keys variable-name
import { Model } from "objection";
import path from "path";
import BaseModel from "./base.model";
import { Scene } from "./scene.model";
import { ScrapedItem } from "./scraped-item.model";

export class Studio extends BaseModel {
  public static tableName = "studios";

  // public static jsonSchema = {
  //   type: "object",
  //   required: ["path", "checksum"],

  //   properties: {
  //     id: { type: "integer" },
  //     path: { type: "string" },
  //     checksum: { type: "string" },
  //     scene_id: { type: ["integer", "null"] },
  //     created_at: { type: "string" },
  //     updated_at: { type: "string" },
  //   },
  // };

  public static relationMappings = {
    scenes: {
      relation: Model.HasManyRelation,
      modelClass: path.join(__dirname, "scene.model"),
      join: {
        from: "studios.id",
        to: "scenes.studio_id",
      },
    },
    scraped_items: {
      relation: Model.HasManyRelation,
      modelClass: path.join(__dirname, "scraped-item.model"),
      join: {
        from: "studios.id",
        to: "scraped_items.studio_id",
      },
    },
  };

  public id?: number;
  public image?: Buffer;
  public checksum?: string;
  public name?: string;
  public url?: string;

  // Optional eager relations.
  public scenes?: Scene[];
  public scraped_items?: ScrapedItem[];
}
