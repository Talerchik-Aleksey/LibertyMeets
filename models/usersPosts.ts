import {
  Table,
  Column,
  DataType,
  AllowNull,
  Model,
  PrimaryKey,
  BelongsTo,
  AutoIncrement,
  CreatedAt,
  ForeignKey,
} from "sequelize-typescript";
import { Posts } from "./posts";
import { Users } from "./users";

@Table({
  timestamps: false,
  paranoid: false,
  underscored: true,
  tableName: "user_posts",
  initialAutoIncrement: "1",
})
export class UserPosts extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.NUMBER)
  id!: number;

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
}
