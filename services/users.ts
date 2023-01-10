import { UserType } from "../types/general";
import { HttpError } from "../utils/HttpError";
import { compareSync, hashSync } from "bcryptjs";
import config from "config";
import { Users } from "../models/users";
import { v4 } from "uuid";

const saltLength = config.get<number>("hash.saltLength");

export async function saveUserToDatabase(user: UserType) {
  const isUsed = await isEmailAlreadyUsed(user.email);
  if (isUsed) {
    throw new HttpError(400, "email already used");
  }

  const userToSave = {
    email: user.email,
    password: hashSync(user.password, saltLength),
    reset_pwd_token: v4(),
  };
  await Users.create(userToSave);
}

async function isEmailAlreadyUsed(email: string): Promise<boolean> {
  const users = await Users.findAll({
    where: {
      email,
    },
  });

  return users.length > 0;
}

export async function getUserByCredentials(user: UserType) {}
