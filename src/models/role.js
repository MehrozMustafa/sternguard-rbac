import { Model } from "objection";
import { User } from "./user.js";
import { Permission } from "./permission.js";

export class Role extends Model {
  static get tableName() {
    return "roles";
  }

  static get relationMappings() {
    return {
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

      users: {
        relation: Model.ManyToManyRelation,
        modelClass: User,
        join: {
          from: "roles.id",
          through: {
            from: "user_roles.roleId",
            to: "user_roles.userId",
          },
          to: "users.id",
        },
      },
    };
  }
}
