// tslint:disable:object-literal-sort-keys variable-name
import { Model } from "objection";
import path from "path";
import BaseModel from "./base.model";
import { Studio } from "./studio.model";

export class ScrapedItem extends BaseModel {
  public static tableName = "scraped_items";

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
    studio: {
      relation: Model.BelongsToOneRelation,
      modelClass: path.join(__dirname, "studio.model"),
      join: {
        from: "scraped_items.studio_id",
        to: "studios.id",
      },
    },
  };

  public id?: number;
  public title?: string;
  public description?: string;
  public url?: string;
  public date?: string; // TODO: date?
  public rating?: string;
  public tags?: string;
  public models?: string;
  public episode?: number;
  public gallery_filename?: string;
  public gallery_url?: string;
  public video_filename?: string;
  public video_url?: string;
  public studio_id: number;

  // Optional eager relations.
  public studio?: Studio;
}
