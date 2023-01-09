import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { AppDataSource } from "../migrations/data-source";

@Entity()
export class User {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column()
  token: string | undefined;

  @Column()
  is_admin!: boolean;

  @Column()
  is_enabled!: boolean;

  @Column()
  created_at!: Date;

  @Column()
  updated_at!: Date;

  @Column()
  deleted_at!: Date;
}

export const usersRepo = AppDataSource.getRepository(User);
