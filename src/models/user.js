import { Model } from "objection";
import Role from "./role.js";

export default class User extends Model {
  static tableName = "users";

  static relationMappings = {
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
