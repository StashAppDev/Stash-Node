// tslint:disable:object-literal-sort-keys variable-name
import { Model } from "objection";
import path from "path";
import BaseModel from "./base.model";
import { Scene } from "./scene.model";

export class Performer extends BaseModel {
  public static tableName = "performers";

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
      relation: Model.ManyToManyRelation,
      modelClass: path.join(__dirname, "scene.model"),
      join: {
        from: "performers.id",
        through: {
          from: "performers_scenes.performer_id",
          to: "performers_scenes.scene_id",
        },
        to: "scenes.id",
      },
    },
  };

  public id?: number;
  public image?: Buffer;
  public checksum?: string;
  public name?: string;
  public url?: string;
  public twitter?: string;
  public instagram?: string;
  public birthdate?: string; // TODO dates?
  public ethnicity?: string;
  public country?: string;
  public eye_color?: string;
  public height?: string;
  public measurements?: string;
  public fake_tits?: string;
  public career_length?: string;
  public tattoos?: string;
  public piercings?: string;
  public aliases?: string;
  public favorite?: boolean;

  // Optional eager relations.
  public scenes?: Scene[];
}
