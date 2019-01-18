import { Model, QueryBuilder } from "objection";
import { FindFilterType } from "../typings/graphql";

export class BaseQueryBuilder<T extends Model> extends QueryBuilder<T> {
  protected findFilter: FindFilterType;

  constructor(type: new() => T, findFilter?: FindFilterType | null) {
    // @ts-ignore
    super(type); // https://github.com/Vincit/objection.js/blob/1.4.0/lib/queryBuilder/QueryBuilder.js#L42
    this.findFilter = !!findFilter ? findFilter : {};
  }

  public async paginate() {
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

    // Select only distinct id's to speed up the query...
    const paginationResult = await this.page(page - 1, perPage).distinct(`${this.modelClass().tableName}.id`);
    // ...then fetch each model in a seperate query.
    for (let index = 0; index < paginationResult.results.length; index++) {
      const model = paginationResult.results[index];
      paginationResult.results[index] = await model.$query();
    }

    return paginationResult;
  }

  public sort(defaultSort: string) {
    const sort = !!this.findFilter.sort ? this.findFilter.sort : defaultSort;
    const findFilterDirection = !!this.findFilter.direction ? this.findFilter.direction : "ASC";

    const sortDirection = ["ASC", "DESC"].includes(findFilterDirection) ? findFilterDirection : "ASC";
    const sortColumn = this.getColumnNames().includes(sort) ? sort : defaultSort;

    if (sort.includes("_count")) {
      const tableName = sort.split("_")[0]; // TODO: pluralize?
      return this.leftJoinRelation(tableName)
        .groupBy(`${this.modelClass().tableName}.id`)
        .orderByRaw(`COUNT(${tableName}.id) ${sortDirection}`);
    } else if (sort === "filesize") {
      return this.orderByRaw(`cast(${this.modelClass().tableName}.size as integer) ${sortDirection}`);
    } else if (sort === "random") {
      return this.orderByRaw("RANDOM()");
    } else {
      return this.orderByRaw(`${this.modelClass().tableName}.${sortColumn} ${sortDirection}`);
    }
  }

  public search() {
    throw new Error("Override");
  }

  private getColumnNames(): string[] {
    return this.modelClass().tableMetadata().columns;
  }
}
