import { FindOptions } from "sequelize";
import { Database } from "../db/database";
import { FindFilterType } from "../typings/graphql";

export class BaseQueryBuilder<TInstance, TAttributes> {
  public opts: FindOptions<TAttributes> = {};
  public model: any;
  public findFilter: FindFilterType;

  constructor(model: any, findFilter?: FindFilterType | null) {
    this.model = model;
    this.findFilter = !!findFilter ? findFilter : {};
  }

  public paginate(): BaseQueryBuilder<TInstance, TAttributes> {
    let page = !!this.findFilter.page ? this.findFilter.page : 1;
    if (page < 1) {
      page = 1;
    }

    let perPage = !!this.findFilter.per_page ? this.findFilter.per_page : 25;
    if (perPage > 120) {
      perPage = 120;
    } else if (perPage < 1) {
      perPage = 1;
    }

    this.opts.offset = (page - 1) * perPage;
    this.opts.limit = perPage;

    return this;
  }

  public sort(defaultSort: string): BaseQueryBuilder<TInstance, TAttributes> {
    const sort = !!this.findFilter.sort ? this.findFilter.sort : defaultSort;
    const findFilterDirection = !!this.findFilter.direction ? this.findFilter.direction : "ASC";

    const sortDirection = ["ASC", "DESC"].includes(findFilterDirection) ? findFilterDirection : "ASC";
    const sortColumn = this.getColumnNames().includes(sort) ? sort : defaultSort;

    if (sort.includes("_count")) {
      // t_name = params[:sort].split('_').first.pluralize
      // const tableName = findFilter.sort.split('_')[0].pluralize // TODO
      // left_joins(t_name.to_sym).group(:id).reorder("COUNT(#{t_name}.id) #{sort_direction}")
    } else if (sort === "filesize") {
      // reorder("cast(#{table_name}.size as integer) #{sort_direction}") // TODO
    } else if (sort === "random") {
      this.opts.order = Database.sequelize.random();
    } else {
      // TODO make sure this continues to work
      this.opts.order = Database.sequelize.literal(`${this.model!.name}.${sortColumn} ${sortDirection}`);
    }

    return this;
  }

  private getColumnNames(): string[] {
    return Object.keys(this.model.fieldRawAttributesMap);
  }
}
