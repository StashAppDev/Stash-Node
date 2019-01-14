import { Performer } from "../db/models/performer.model";
import { GQL } from "../typings/graphql";
import { BaseQueryBuilder } from "./base.querybuilder";

export class PerformerQueryBuilder extends BaseQueryBuilder<Performer> {
  public args: GQL.FindPerformersQueryArgs;

  constructor(args: GQL.FindPerformersQueryArgs) {
    super(Performer, args.filter);
    this.args = args;
  }

  public filter() {
    if (!this.args.performer_filter) { return this; }
    const performerFilter = this.args.performer_filter;

    if (performerFilter.filter_favorites !== undefined) {
      this.filterFavorites(performerFilter.filter_favorites);
    }

    return this;
  }

  public search() {
    const q = this.findFilter.q;
    if (!q) { return this; }
    this
      .where((builder) => {
        builder
          .where("performers.name", "LIKE", `%${q}%`)
          .orWhere("performers.checksum", "LIKE", `%${q}%`)
          .orWhere("performers.birthdate", "LIKE", `%${q}%`)
          .orWhere("performers.ethnicity", "LIKE", `%${q}%`);
      });
    return this;
  }

  private filterFavorites(shouldFilter: boolean) {
    return this.where({favorite: shouldFilter});
  }
}
