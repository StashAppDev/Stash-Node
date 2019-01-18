import { raw } from "objection";
import { Scene } from "../db/models/scene.model";
import { GQL, ResolutionEnum } from "../typings/graphql";
import { BaseQueryBuilder } from "./base.querybuilder";

export class SceneQueryBuilder extends BaseQueryBuilder<Scene> {
  public args: GQL.FindScenesQueryArgs;

  constructor(args: GQL.FindScenesQueryArgs) {
    super(Scene, args.filter);
    this.args = args;
  }

  public filter() {
    if (!this.args.scene_filter) { return this; }
    const sceneFilter = this.args.scene_filter;

    this.leftJoinRelation("scene_markers");
    this.leftJoinRelation("performers");
    this.leftJoinRelation("studio");

    if (!!sceneFilter.rating) {
      this.rating(sceneFilter.rating);
    }
    if (!!sceneFilter.resolution) {
      this.resolution(sceneFilter.resolution);
    }
    if (!!sceneFilter.has_markers) {
      this.hasMarkers(sceneFilter.has_markers);
    }
    if (!!sceneFilter.performer_id) {
      this.performerId(sceneFilter.performer_id);
    }
    if (!!sceneFilter.studio_id) {
      this.studioId(sceneFilter.studio_id);
    }

    return this;
  }

  public search() {
    const q = this.findFilter.q;
    if (!q) { return this; }
    // .eager("[scene_markers(selectTitleAndId)]", {
    //   selectTitleAndId: (builder) => {
    //     builder.select("id", "title");
    //   },
    // })
    // let join = this.leftJoinRelation("scene_markers");
    for (const searchTerm of q.split(" ")) {
      this.where((builder) => {
        builder
          .where("scenes.title", "LIKE", `%${searchTerm}%`)
          .orWhere("scenes.details", "LIKE", `%${searchTerm}%`)
          .orWhere("scenes.path", "LIKE", `%${searchTerm}%`)
          .orWhere("scenes.checksum", "LIKE", `%${searchTerm}%`)
          .orWhere("scene_markers.title", "LIKE", `%${searchTerm}%`);
      });
    }
    return this;
  }

  private rating(rating: number) {
    return this.where({ rating });
  }

  private resolution(resolution: ResolutionEnum) {
    switch (resolution) {
      case "LOW": return this.where((b) => {
        b.where("scenes.height", ">=", 240).andWhere("scenes.height", "<", 480);
      });
      case "STANDARD": return this.where((b) => {
        b.where("scenes.height", ">=", 480).andWhere("scenes.height", "<", 720);
      });
      case "STANDARD_HD": return this.where((b) => {
        b.where("scenes.height", ">=", 720).andWhere("scenes.height", "<", 1080);
      });
      case "FULL_HD": return this.where((b) => {
        b.where("scenes.height", ">=", 1080).andWhere("scenes.height", "<", 2160);
      });
      case "FOUR_K": return this.where("scenes.height", ">=", 2160);
      default: return this.where("scenes.height", "<", 240);
    }
  }

  private hasMarkers(has: string) {
    if (has === "true") {
      return this.groupBy("scenes.id").having(raw("count(scene_markers.scene_id) > 0"));
    } else {
      return this.whereNull("scene_markers.id");
    }
  }

  private performerId(id: string) {
    return this.where("performers.id", id);
  }

  private studioId(id: string) {
    return this.where("studio.id", id);
  }
}
