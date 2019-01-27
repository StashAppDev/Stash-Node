// tslint:disable:object-literal-sort-keys variable-name
import { Model, QueryBuilder } from "objection";
import path from "path";
import { GQL } from "../../typings/graphql";
import BaseModel from "./base.model";
import { SceneMarker } from "./scene-marker.model";
import { Scene } from "./scene.model";

export class Tag extends BaseModel {
  public static tableName = "tags";

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
    primary_scene_markers: {
      relation: Model.HasManyRelation,
      modelClass: path.join(__dirname, "scene-marker.model"),
      join: {
        from: "tags.id",
        to: "scene_markers.primary_tag_id",
      },
    },
    scene_markers: {
      relation: Model.ManyToManyRelation,
      modelClass: path.join(__dirname, "scene-marker.model"),
      join: {
        from: "tags.id",
        through: {
          from: "scene_markers_tags.tag_id",
          to: "scene_markers_tags.scene_marker_id",
        },
        to: "scene_markers.id",
      },
    },
    scenes: {
      relation: Model.ManyToManyRelation,
      modelClass: path.join(__dirname, "scene.model"),
      join: {
        from: "tags.id",
        through: {
          from: "scenes_tags.tag_id",
          to: "scenes_tags.scene_id",
        },
        to: "scenes.id",
      },
    },
  };

  public static modifiers = {
    orderedByName: (builder: QueryBuilder<Tag>) => builder.orderBy("name"),
  };

  public id?: number;
  public name?: string;
  public seconds?: number;

  // Optional eager relations.
  public primary_scene_markers?: SceneMarker[];
  public scene_markers?: SceneMarker[];
  public scenes?: Scene[];

  public toGraphQL(): GQL.Tag {
    return {
      id: this.id!.toString(),
      name: this.name!,
    };
  }
}
