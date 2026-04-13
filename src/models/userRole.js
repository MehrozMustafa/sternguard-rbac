import { Model } from "objection";
import { User } from "./user.js";
import { Role } from "./role.js";

export class UserRole extends Model {
  static get tableName() {
    return "user_roles";
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "user_roles.userId",
          to: "users.id",
        },
      },
      role: {
        relation: Model.BelongsToOneRelation,
        modelClass: Role,
        join: {
          from: "user_roles.roleId",
          to: "roles.id",
        },
      },
    };
  }
}
