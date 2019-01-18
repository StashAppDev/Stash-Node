import { Gallery } from "../db/models/gallery.model";
import { GQL } from "../typings/graphql";
import { BaseQueryBuilder } from "./base.querybuilder";

export class GalleryQueryBuilder extends BaseQueryBuilder<Gallery> {
  public args: GQL.FindGalleriesQueryArgs;

  constructor(args: GQL.FindGalleriesQueryArgs) {
    super(Gallery, args.filter);
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
          .where("galleries.path", "LIKE", `%${q}%`)
          .orWhere("galleries.checksum", "LIKE", `%${q}%`);
      });
    return this;
  }
}
