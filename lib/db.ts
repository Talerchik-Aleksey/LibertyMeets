import { Sequelize } from "sequelize-typescript";
import { Dialect, PoolOptions } from "sequelize";
import config from "config";
import { Users } from "../models/users";

export type ConnectionOptionsType = {
  type?: Dialect;
  dialect?: Dialect;
  host: string;
  port?: string | number;
  database: string;
  username: string;
  password: string;
  pool?: PoolOptions;
};

export async function connect(): Promise<Sequelize> {
  const options = config.get<ConnectionOptionsType>("db");
  console.log(options)
  const sequelize = new Sequelize({
    dialect: options.dialect || options.type || "postgres",
    host: options.host,
    database: options.database,
    username: options.username,
    password: options.password,
    benchmark: true,
    pool: options.pool,
    transactionType: "IMMEDIATE" as any,
    models: [Users],
  });
  return sequelize;
}

