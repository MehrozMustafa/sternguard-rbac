import { Model } from "objection";

export class RoutePermission extends Model {
  static get tableName() {
    return "route_permissions";
  }
}
