import type { NextApiRequest, NextApiResponse } from "next";
import { deleteAccount } from "../../../services/users";
import { connect } from "../../../utils/db";
import { HttpError } from "../../../utils/HttpError";
import { deletePosts } from "../../../services/posts";
import { getSession } from "next-auth/react";

type ResType = {
  message: string;
};

const sequelize = connect();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResType>
) {
  try {
    await (
      await sequelize
    ).transaction(async (t) => {
      if (!req.method || req.method! !== "POST") {
        res.status(405);
        return;
      }

      const session = await getSession({ req });

      if (!session) {
        throw new HttpError(400, "user not valid");
      }

      const resDelPosts = await deletePosts(session?.user.id as number, t);
      if (resDelPosts) {
        res.status(500).json({ message: resDelPosts.message });
        return;
      }

      const resDelAcc = await deleteAccount(session?.user.id as number, t);
      if (resDelAcc) {
        res.status(500).json({ message: resDelAcc.message });
        return;
      }
      res.status(200).json({ message: "success" });
    });
  } catch (err) {
    if (err instanceof HttpError) {
      const httpErr = err as HttpError;
      res.status(httpErr.httpCode).json({ message: httpErr.message });
      return;
    } else {
      const error = err as Error;
      res.status(500).json({ message: error.message });
      return;
    }
  }
}
