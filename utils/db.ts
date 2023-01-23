import { Sequelize } from "sequelize-typescript";
import { Dialect, PoolOptions } from "sequelize";
import config from "config";
import { Users } from "../models/users";
import { Posts } from "../models/posts";
import { UserPosts } from "../models/usersPosts";
import { FavoritePosts } from "../models/favoritePosts";
import { Threads } from "../models/threads";
import { ThreadMessages } from "../models/threadMessages";

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

  const sequelize = new Sequelize({
    dialect: options.dialect || options.type || "postgres",
    host: options.host,
    database: options.database,
    username: options.username,
    password: options.password,
    benchmark: true,
    pool: options.pool,
    transactionType: "IMMEDIATE" as any,
    models: [Users, Posts, UserPosts, FavoritePosts, Threads, ThreadMessages],
  });
  return sequelize;
}
