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
} from "sequelize-typescript";
import { v4 } from "uuid";
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
  @ForeignKey(() => Threads)
  thread_id!: number;

  @AllowNull(false)
  @Column(DataType.TEXT)
  message!: string;

  @CreatedAt
  @Column
  createdAt!: Date;
}
