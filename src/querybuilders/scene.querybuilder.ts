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

    if (!!sceneFilter.rating) {
      this.rating(sceneFilter.rating);
    }
    if (!!sceneFilter.resolution) {
      this.resolution(sceneFilter.resolution);
    }

    return this;
  }

  public search() {
    const q = this.findFilter.q;
    if (!q) { return this; }
    this
    // .eager("[scene_markers(selectTitleAndId)]", {
    //   selectTitleAndId: (builder) => {
    //     builder.select("id", "title");
    //   },
    // })
    .leftJoinRelation("scene_markers")
    .where((builder) => {
      builder
        .where("scenes.title", "LIKE", `%${q}%`)
        .orWhere("details", "LIKE", `%${q}%`)
        .orWhere("path", "LIKE", `%${q}%`)
        .orWhere("checksum", "LIKE", `%${q}%`)
        .orWhere("scene_markers.title", "LIKE", `%${q}%`);
    });
    return this;
  }

  private rating(rating: number) {
    return this.where({ rating });
  }

  private resolution(resolution: ResolutionEnum) {
    switch (resolution) {
      case "LOW": return this.where((b) => { b.where("height", ">=", 240).andWhere("height", "<", 480); });
      case "STANDARD": return this.where((b) => { b.where("height", ">=", 480).andWhere("height", "<", 720); });
      case "STANDARD_HD": return this.where((b) => { b.where("height", ">=", 720).andWhere("height", "<", 1080); });
      case "FULL_HD": return this.where((b) => { b.where("height", ">=", 1080).andWhere("height", "<", 2160); });
      case "FOUR_K": return this.where("height", ">=", 2160);
      default: return this.where("height", "<", 240);
    }
  }
}
