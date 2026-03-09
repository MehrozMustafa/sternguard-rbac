import { Model } from "objection";
import Permission from "./permission.js";

export default class Role extends Model {
  static tableName = "roles";

  static relationMappings = {
    permissions: {
      relation: Model.ManyToManyRelation,
      modelClass: Permission,
      join: {
        from: "roles.id",
        through: {
          from: "role_permissions.roleId",
          to: "role_permissions.permissionId",
        },
        to: "permissions.id",
      },
    },
  };
}
