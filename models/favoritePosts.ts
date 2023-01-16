import {
  Table,
  Column,
  DataType,
  AllowNull,
  Model,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { Posts } from "./posts";
import { Users } from "./users";

@Table({
  timestamps: false,
  paranoid: false,
  underscored: true,
  tableName: "favorite_posts",
  initialAutoIncrement: "1",
})
export class FavoritePosts extends Model {
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

  @BelongsTo(() => Posts)
  post?: Posts;
}
