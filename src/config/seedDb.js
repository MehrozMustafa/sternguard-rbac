import knexConstructor from "knex";
import { Model } from "objection";
import knexConfig from "./knexfile.cjs";

const knex = knexConstructor(knexConfig.development);

// bind for seeds
Model.knex(knex);

export default knex;
