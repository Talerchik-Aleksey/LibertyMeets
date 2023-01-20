import { UserType } from "../types/general";
import { HttpError } from "../utils/HttpError";
import { compareSync, hashSync } from "bcryptjs";
import config from "config";
import { Users } from "../models/users";
import { connect } from "../utils/db";
import { Posts } from "../models/posts";
import { FavoritePosts } from "../models/favoritePosts";
import { Transaction } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import { Threads } from "../models/threads";
import { ThreadMessages } from "../models/threadMessages";
import { UserPosts } from "../models/usersPosts";

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

export async function findUser(email: string) {
  const foundUser = await Users.findOne({ where: { email: email } });
  if (!foundUser) {
    return null;
  }

  return foundUser;
}

export async function fillToken(email: string, reset_pwd_token: string) {
  await Users.update(
    { reset_pwd_token },
    {
      where: {
        email,
      },
    }
  );
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

export async function isPasswordUsed(userId: number, password: string) {
  const foundUser = await Users.findOne({ where: { id: userId } });
  if (!foundUser) {
    return null;
  }

  return compareSync(password, foundUser.password);
}

export async function changePasswordByUserId(userId: number, password: string) {
  await Users.update(
    { password: hashSync(password, saltLength) },
    {
      where: {
        id: userId,
      },
    }
  );
}

export async function isRightToken(token: string): Promise<boolean> {
  const users = await Users.findAll({
    where: {
      reset_pwd_token: token,
    },
  });

  return users.length > 0;
}

export async function changePassword(password: string, token: string) {
  const foundUser = await Users.findOne({ where: { reset_pwd_token: token } });
  if (!foundUser) {
    return null;
  }
  const result = await Users.update(
    { reset_pwd_token: null, password: hashSync(password, saltLength) },
    {
      where: {
        email: foundUser.email,
      },
    }
  );

  return result;
}

export async function deleteAccount(
  userId: number,
  sequelize: Promise<Sequelize>
) {
  const t = (await sequelize).transaction();
  const transaction: any = { transaction: t };
  try {
    await Users.destroy({ where: { id: userId }, transaction });

    await FavoritePosts.destroy({
      where: {
        user_id: userId,
      },
      transaction,
    });

    const posts = await Posts.findAll({ where: { author_id: userId } });
    console.log('posts <-------', posts);
    if (posts.length === 0) {
      return;
    }
    const postIds = posts.map((item) => item.id);

    const thread = await Threads.findAll({ where: { post_id: postIds } });
    console.log('thread <-------', thread);

    await UserPosts.destroy({ where: { post_id: postIds }, transaction });

    await Posts.destroy({
      where: {
        author_id: userId,
      },
      transaction,
    });

    if (thread.length === 0) {
      return;
    }
    const threadIds = thread.map((item) => item.id);
    await ThreadMessages.destroy({
      where: { thread_id: threadIds },
      transaction,
    });

    await Threads.destroy({ where: { post_id: postIds }, transaction });
  } catch (err) {
    return err;
  }
}
