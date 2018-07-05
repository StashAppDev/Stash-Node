import { Repository, SelectQueryBuilder } from "typeorm";
import { FindFilterType } from "../typings/graphql";

export class BaseQueryBuilder<T> {
  public qb: SelectQueryBuilder<T>;
  public findFilter: FindFilterType;

  constructor(qb: SelectQueryBuilder<T>, findFilter?: FindFilterType | null) {
    this.qb = qb;
    this.findFilter = !!findFilter ? findFilter : {};
  }

  public paginate(): BaseQueryBuilder<T> {
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

    this.qb
      .skip((page - 1) * perPage)
      .take(perPage);

    return this;
  }

  public sort(repository: Repository<T>, defaultSort: string): BaseQueryBuilder<T> {
    const sort = !!this.findFilter.sort ? this.findFilter.sort : defaultSort;
    const findFilterDirection = !!this.findFilter.direction ? this.findFilter.direction : "ASC";

    const sortDirection = ["ASC", "DESC"].includes(findFilterDirection) ? findFilterDirection : "ASC";
    const sortColumn = this.getColumnNames(repository).includes(sort) ? sort : defaultSort;

    if (sort.includes("_count")) {
      // t_name = params[:sort].split('_').first.pluralize
      // const tableName = findFilter.sort.split('_')[0].pluralize // TODO
      // left_joins(t_name.to_sym).group(:id).reorder("COUNT(#{t_name}.id) #{sort_direction}")
    } else if (sort === "filesize") {
      // reorder("cast(#{table_name}.size as integer) #{sort_direction}") // TODO
    } else if (sort === "random") {
      this.qb.orderBy("RANDOM()");
    } else {
      this.qb.orderBy(`${repository.metadata.tableName}.${sortColumn}`, sortDirection);
    }

    return this;
  }

  private getColumnNames(repository: Repository<T>): string[] {
    return repository.metadata.columns.map((column) => column.databaseName);
  }
}
