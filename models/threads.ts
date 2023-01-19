import {
  Table,
  Column,
  DataType,
  AllowNull,
  Model,
  Default,
  PrimaryKey,
  CreatedAt,
  ForeignKey,
  HasOne,
} from "sequelize-typescript";
import { v4 } from "uuid";
import { Posts } from "./posts";
import { Users } from "./users";

@Table({
  timestamps: true,
  paranoid: true,
  underscored: true,
  tableName: "threads",
  initialAutoIncrement: "1",
})
export class Threads extends Model {
  @PrimaryKey
  @Column(DataType.UUIDV4)
  @Default(v4)
  id!: string;

  @AllowNull(false)
  @Column(DataType.NUMBER)
  @ForeignKey(() => Users)
  user_id!: number;

  @AllowNull(false)
  @Column(DataType.NUMBER)
  @ForeignKey(() => Posts)
  post_id!: number;

  @CreatedAt
  @Column
  createdAt!: Date;

  @HasOne(() => Posts)
  post?: Posts;
}
