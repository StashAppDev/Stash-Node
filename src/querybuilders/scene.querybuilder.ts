import { SelectQueryBuilder } from "typeorm";
import { SceneEntity } from "../entities/scene.entity";
import { GQL } from "../typings/graphql";
import { BaseQueryBuilder } from "./base.querybuilder";

export class SceneQueryBuilder extends BaseQueryBuilder<SceneEntity> {
  public args: GQL.FindScenesQueryArgs;

  constructor(qb: SelectQueryBuilder<SceneEntity>, args: GQL.FindScenesQueryArgs) {
    super(qb, args.filter);
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
    this.qb.andWhere("rating = :rating", { rating });
    return this;
  }
}
