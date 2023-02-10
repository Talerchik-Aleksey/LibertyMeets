import {
  Table,
  Column,
  DataType,
  AllowNull,
  Model,
  Default,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  ForeignKey,
  HasMany,
} from "sequelize-typescript";
import { FavoritePosts } from "./favoritePosts";
import { Threads } from "./threads";
import { Users } from "./users";

@Table({
  timestamps: true,
  paranoid: true,
  underscored: true,
  tableName: "posts",
  initialAutoIncrement: "1",
})
export class Posts extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.NUMBER)
  id!: number;

  @AllowNull(false)
  @Column(DataType.NUMBER)
  @ForeignKey(() => Users)
  author_id!: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  title!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  category!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  description!: string;

  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  is_public!: boolean;

  @AllowNull(true)
  @Column(DataType.STRING)
  location_name!: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  street!: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  city!: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  state!: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  zip!: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  geo!: string;

  @AllowNull(false)
  @Default(true)
  @Column(DataType.BOOLEAN)
  is_enabled!: boolean;

  @AllowNull(true)
  @Column(DataType.DECIMAL)
  lat!: number;

  @AllowNull(true)
  @Column(DataType.DECIMAL)
  lng!: number;

  @CreatedAt
  @Column
  created_at!: Date;

  @UpdatedAt
  @Column
  updated_at!: Date;

  @DeletedAt
  @Column
  deleted_at!: Date;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  is_blocked!: boolean;

  @HasMany(() => FavoritePosts, { foreignKey: "post_id" })
  favoriteUsers?: FavoritePosts[];

  //@HasMany(() => Threads, { foreignKey: "post_id" })
  //threads?: Threads[];
}
