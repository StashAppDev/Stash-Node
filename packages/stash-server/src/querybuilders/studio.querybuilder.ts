import { Studio } from "../db/models/studio.model";
import { GQL } from "../typings/graphql";
import { BaseQueryBuilder } from "./base.querybuilder";

export class StudioQueryBuilder extends BaseQueryBuilder<Studio> {
  public args: GQL.FindStudiosQueryArgs;

  constructor(args: GQL.FindStudiosQueryArgs) {
    super(Studio, args.filter);
    this.args = args;
  }

  public filter() {
    return this;
  }

  public search() {
    const q = this.findFilter.q;
    if (!q) { return this; }
    this
      .where((builder) => {
        builder
          .where("studios.name", "LIKE", `%${q}%`);
      });
    return this;
  }
}
