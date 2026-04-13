import { Model } from "objection";

export class Permission extends Model {
  static get tableName() {
    return "permissions";
  }
}
