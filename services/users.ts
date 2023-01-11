import { UserType } from "../types/general";
import { HttpError } from "../utils/HttpError";
import { compareSync, hashSync } from "bcryptjs";
import config from "config";
import { Users } from "../models/users";
import { connect } from "../utils/db";

const saltLength = config.get<number>("hash.saltLength");
connect();

export async function saveUserToDatabase(user: UserType) {
  const isUsed = await isEmailAlreadyUsed(user.email);
  if (isUsed) {
    throw new HttpError(400, "email already used");
  }

  const userToSave = {
    email: user.email,
    password: hashSync(user.password, saltLength),
  };
  await Users.create(userToSave);
}

export async function isEmailAlreadyUsed(email: string): Promise<boolean> {
  const users = await Users.findAll({
    where: {
      email,
    },
  });

  return users.length > 0;
}

export async function createResetToken(email: string, reset_pwd_token: string) {
  await Users.update({ reset_pwd_token },{
    where: {
      email,
    },
  });
}

export async function getUserByCredentials(
  user: UserType
): Promise<Users | null> {
  const foundUser = await Users.findOne({ where: { email: user.email } });
  if (!foundUser) {
    return null;
  }
  if (!compareSync(user.password, foundUser.password)) {
    return null;
  }
  return foundUser;
}

export async function isRightUser(password: string, token: string) {
  const foundUser = await Users.findOne({ where: { reset_pwd_token: token } });
  if (!foundUser) {
    return null;
  }
  const result = await Users.update({ reset_pwd_token: null, password: hashSync(password, saltLength) },{
    where: {
      email: foundUser.email,
    },
  });

  return result;
}
