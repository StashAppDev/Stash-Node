// tslint:disable:object-literal-sort-keys variable-name
import fs from "fs";
import { Model } from "objection";
import path from "path";
import { Stash } from "../../stash/stash";
import { FileUtils } from "../../utils/file.utils";
import { VttUtils } from "../../utils/vtt.utils";
import BaseModel from "./base.model";
import { Gallery } from "./gallery.model";
import { Performer } from "./performer.model";
import { SceneMarker } from "./scene-marker.model";
import { Studio } from "./studio.model";
import { Tag } from "./tag.model";

export class Scene extends BaseModel {
  public static tableName = "scenes";

  // // Optional JSON schema. This is not the database schema! Nothing is generated
  // // based on this. This is only used for validation. Whenever a model instance
  // // is created it is checked against this schema. http://json-schema.org/.
  // public static jsonSchema = {
  //   type: "object",
  //   required: ['name'],

  //   properties: {
  //     id: { type: "integer" },
  //     ownerId: { type: ["integer", "null"] },
  //     name: { type: 'string', minLength: 1, maxLength: 255 },
  //     species: { type: 'string', minLength: 1, maxLength: 255 }
  //   }
  // };

  public static relationMappings = {
    gallery: {
      relation: Model.HasOneRelation,
      modelClass: path.join(__dirname, "gallery.model"),
      join: {
        from: "scenes.id",
        to: "galleries.scene_id",
      },
    },
    // TODO: Cascade deletes?  Add to schema?
    scene_markers: {
      relation: Model.HasManyRelation,
      modelClass: path.join(__dirname, "scene-marker.model"),
      join: {
        from: "scenes.id",
        to: "scene_markers.scene_id",
      },
    },
    studio: {
      relation: Model.BelongsToOneRelation,
      modelClass: path.join(__dirname, "studio.model"),
      join: {
        from: "scenes.studio_id",
        to: "studios.id",
      },
    },
    tags: {
      relation: Model.ManyToManyRelation,
      modelClass: path.join(__dirname, "tag.model"),
      join: {
        from: "scenes.id",
        through: {
          from: "scenes_tags.scene_id",
          to: "scenes_tags.tag_id",
        },
        to: "tags.id",
      },
    },
    performers: {
      relation: Model.ManyToManyRelation,
      modelClass: path.join(__dirname, "performer.model"),
      join: {
        from: "scenes.id",
        through: {
          from: "performers_scenes.scene_id",
          to: "performers_scenes.performer_id",
        },
        to: "performers.id",
      },
    },
  };

  public id?: number;
  public checksum?: string;
  public title?: string;
  public details?: string;
  public url?: string;
  public date?: string;
  public rating?: number;
  public path?: string;
  public size?: string;
  public duration?: number;
  public video_codec?: string;
  public audio_codec?: string;
  public width?: number;
  public height?: number;
  public framerate?: number;
  public bitrate?: number;
  public studio_id?: number;

  public performers?: Performer[];
  public scene_markers?: SceneMarker[];
  public studio?: Studio;
  public gallery?: Gallery;
  public tags?: Tag[];

  public async getMimeType() {
    const fileType = await FileUtils.getFileType(this.path);
    return (!!fileType) ? fileType.mime : undefined;
  }

  public async isStreamable() {
    const mimeType = await this.getMimeType();
    const valid = mimeType === "video/quicktime" || mimeType === "video/mp4" || mimeType === "video/webm";
    if (!valid) {
      const transcodePath = Stash.paths.scene.getTranscodePath(this.checksum || "");
      return fs.existsSync(transcodePath);
    } else {
      return valid;
    }
  }

  public async makeChapterVtt() {
    const sceneMarkers = await this.$relatedQuery<SceneMarker>("scene_markers");
    return VttUtils.makeChapterVtt(sceneMarkers);
  }
}
