import { Model, QueryBuilder } from "objection";
import { FindFilterType } from "../typings/graphql";

export class BaseQueryBuilder<T extends Model> extends QueryBuilder<T> {
  protected findFilter: FindFilterType;

  constructor(type: new() => T, findFilter?: FindFilterType | null) {
    // @ts-ignore
    super(type); // https://github.com/Vincit/objection.js/blob/1.4.0/lib/queryBuilder/QueryBuilder.js#L42
    this.findFilter = !!findFilter ? findFilter : {};
  }

  public paginate() {
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

    return this.page(page - 1, perPage).distinct(`${this.modelClass().tableName}.*`);
  }

  public sort(defaultSort: string) {
    const sort = !!this.findFilter.sort ? this.findFilter.sort : defaultSort;
    const findFilterDirection = !!this.findFilter.direction ? this.findFilter.direction : "ASC";

    const sortDirection = ["ASC", "DESC"].includes(findFilterDirection) ? findFilterDirection : "ASC";
    const sortColumn = this.getColumnNames().includes(sort) ? sort : defaultSort;

    if (sort.includes("_count")) {
      // t_name = params[:sort].split('_').first.pluralize
      // const tableName = findFilter.sort.split('_')[0].pluralize // TODO
      // left_joins(t_name.to_sym).group(:id).reorder("COUNT(#{t_name}.id) #{sort_direction}")
      return this;
    } else if (sort === "filesize") {
      // reorder("cast(#{table_name}.size as integer) #{sort_direction}") // TODO
      return this;
    } else if (sort === "random") {
      return this.orderByRaw("RANDOM()");
    } else {
      return this.orderByRaw(`${this.modelClass().tableName}.${sortColumn} ${sortDirection}`); // TODO
    }
  }

  public search() {
    throw new Error("Override");
  }

  private getColumnNames(): string[] {
    return this.modelClass().tableMetadata().columns;
  }
}
