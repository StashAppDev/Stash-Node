import { Op } from "sequelize";
import { Database } from "../db/database";
import { ISceneAttributes, ISceneInstance } from "../db/models/scene.model";
import { GQL, ResolutionEnum } from "../typings/graphql";
import { BaseQueryBuilder } from "./base.querybuilder";

export class SceneQueryBuilder extends BaseQueryBuilder<ISceneInstance, ISceneAttributes> {
  public args: GQL.FindScenesQueryArgs;

  constructor(args: GQL.FindScenesQueryArgs) {
    super(Database.Scene, args.filter);
    this.args = args;
  }

  public filter(): SceneQueryBuilder {
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

  private rating(rating: number): SceneQueryBuilder {
    this.opts.where = { ...this.opts.where, ...{ rating } };
    return this;
  }

  private resolution(resolution: ResolutionEnum): SceneQueryBuilder {
    this.scopeOpts.push({ method: ["resolution", resolution] });
    return this;
  }
}
