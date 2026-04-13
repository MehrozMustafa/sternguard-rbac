import { Model } from "objection";
import { Role } from "./role.js";
import { Permission } from "./permission.js";

export class RolePermission extends Model {
  static get tableName() {
    return "role_permissions";
  }

  static get relationMappings() {
    return {
      role: {
        relation: Model.BelongsToOneRelation,
        modelClass: Role,
        join: {
          from: "role_permissions.roleId",
          to: "roles.id",
        },
      },
      permission: {
        relation: Model.BelongsToOneRelation,
        modelClass: Permission,
        join: {
          from: "role_permissions.permissionId",
          to: "permissions.id",
        },
      },
    };
  }
}
