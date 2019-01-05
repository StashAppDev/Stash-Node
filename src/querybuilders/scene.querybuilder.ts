import { Scene } from "../models/scene.model";
import { GQL } from "../typings/graphql";
import { BaseQueryBuilder } from "./base.querybuilder";

export class SceneQueryBuilder extends BaseQueryBuilder<Scene> {
  public args: GQL.FindScenesQueryArgs;

  constructor(args: GQL.FindScenesQueryArgs) {
    super(Scene, args.filter);
    this.args = args;
  }

  public filter(): SceneQueryBuilder {
    if (!this.args.scene_filter) { return this; }
    const sceneFilter = this.args.scene_filter;

    if (!!sceneFilter.rating) {
      this.rating(sceneFilter.rating);
    }

    return this;
  }

  private rating(rating: number): SceneQueryBuilder {
    this.opts.where = { ...this.opts.where, ...{ rating } };
    return this;
  }
}
