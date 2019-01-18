// tslint:disable:object-literal-sort-keys variable-name
import { Model } from "objection";
import path from "path";
import BaseModel from "./base.model";
import { Scene } from "./scene.model";
import { Tag } from "./tag.model";

export class SceneMarker extends BaseModel {
  public static tableName = "scene_markers";

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
    primary_tag: {
      relation: Model.BelongsToOneRelation,
      modelClass: path.join(__dirname, "tag.model"),
      join: {
        from: "scene_markers.primary_tag_id",
        to: "tags.id",
      },
    },
    scene: {
      relation: Model.BelongsToOneRelation,
      modelClass: path.join(__dirname, "scene.model"),
      join: {
        from: "scene_markers.scene_id",
        to: "scenes.id",
      },
    },
    tags: {
      relation: Model.ManyToManyRelation,
      modelClass: path.join(__dirname, "tag.model"),
      join: {
        from: "scene_markers.id",
        through: {
          from: "scene_markers_tags.scene_marker_id",
          to: "scene_markers_tags.tag_id",
        },
        to: "tags.id",
      },
    },
  };

  public id?: number;
  public title: string;
  public seconds?: number;
  public primary_tag_id?: number;
  public scene_id: number;

  // Optional eager relations.
  public primary_tag?: Tag;
  public tags?: Tag[];
  public scene?: Scene;
}
