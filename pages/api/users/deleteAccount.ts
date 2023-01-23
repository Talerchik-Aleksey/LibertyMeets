import type { NextApiRequest, NextApiResponse } from "next";
import { deleteAccount } from "../../../services/users";
import { connect } from "../../../utils/db";
import { HttpError } from "../../../utils/HttpError";
import config from "config";
import { getToken } from "next-auth/jwt";
import { deletePosts } from "../../../services/posts";

type ResType = {
  message: string;
};

const sequelize = connect();
const KEY = config.get<string>("secretKey");

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

      const token = await getToken({ req, secret: KEY });

      if (!token) {
        throw new HttpError(400, "user does not valid");
      }

      const resDelPosts = await deletePosts(token.id as number, t);
      if (resDelPosts) {
        res.status(500).json({ message: resDelPosts.message });
        return;
      }

      const resDelAcc = await deleteAccount(token.id as number, t);
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
