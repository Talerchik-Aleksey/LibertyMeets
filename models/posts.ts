import {
  Table,
  Column,
  DataType,
  AllowNull,
  Model,
  Default,
  PrimaryKey,
  BelongsTo,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  ForeignKey,
} from "sequelize-typescript";
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
  author_id!: string;

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
  @Column(DataType.DATE)
  event_time!: Date;

  @AllowNull(false)
  @Default(true)
  @Column(DataType.BOOLEAN)
  is_enabled!: boolean;

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;

  @DeletedAt
  @Column
  deletedAt!: Date;
}
