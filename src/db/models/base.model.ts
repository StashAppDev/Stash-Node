// tslint:disable:object-literal-sort-keys variable-name
import { Model } from "objection";

export default class BaseModel extends Model {
  public created_at?: string;
  public updated_at?: string;

  public $beforeInsert(context: any) {
    const silent = context.silent;
    if (silent) { return; }
    this.created_at = new Date().toISOString();
    this.updated_at = this.created_at;
  }

  public $beforeUpdate(context: any) {
    const silent = context.silent;
    if (silent) { return; }
    this.updated_at = new Date().toISOString();
  }
}
