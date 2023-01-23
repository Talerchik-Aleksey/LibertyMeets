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
  DeletedAt,
} from "sequelize-typescript";
import { v4 } from "uuid";
import { Threads } from "./threads";
import { Users } from "./users";

@Table({
  timestamps: true,
  paranoid: true,
  underscored: true,
  tableName: "thread_messages",
  initialAutoIncrement: "1",
})
export class ThreadMessages extends Model {
  @PrimaryKey
  @Default(v4)
  @Column(DataType.UUIDV4)
  id!: string;

  @AllowNull(false)
  @Column(DataType.NUMBER)
  @ForeignKey(() => Users)
  user_id!: number;

  @AllowNull(false)
  @Column(DataType.UUIDV4)
  @ForeignKey(() => Threads)
  thread_id!: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  message!: string;

  @CreatedAt
  @Column
  createdAt!: Date;

  @DeletedAt
  @Column
  deletedAt!: Date;
}
