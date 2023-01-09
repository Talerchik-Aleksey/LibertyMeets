import { UserType } from "../types/general";
import { HttpError } from "../utils/HttpError";
import { compareSync, hashSync } from "bcryptjs";
import config from "config";
import { User, usersRepo } from "../models/users";
import { v4 } from "uuid";

const saltLength = config.get<number>("");

export async function saveUserToDatabase(user: UserType) {
  const isUsed = await isEmailAlreadyUsed(user.email);
  if (isUsed) {
    throw new HttpError(400, "email already user");
  }

  const userToSave = new User();
  userToSave.email = user.email;
  userToSave.password = hashSync(user.password, saltLength);
  userToSave.token = v4();

  const userLog = await usersRepo.save(userToSave);
  console.log("save user", userLog);
}

async function isEmailAlreadyUsed(email: string): Promise<boolean> {
  const users = await usersRepo.find({
    where: {
      email,
    },
  });

  return users.length === 0;
}

export async function getUserByCredentials(user: UserType) {
  
}
