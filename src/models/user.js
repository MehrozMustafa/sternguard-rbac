import { Model } from "objection";
import { Role } from "./role.js";

export class User extends Model {
  static get tableName() {
    return "users";
  }
//relation mapping..
  static get relationMappings() {
    return {
      roles: {
        relation: Model.ManyToManyRelation,
        modelClass: Role,
        join: {
          from: "users.id",
          through: {
            from: "user_roles.userId",
            to: "user_roles.roleId",
          },
          to: "roles.id",
        },
      },
    };
  }
}
